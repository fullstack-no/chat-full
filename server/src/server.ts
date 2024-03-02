import dotenv from "dotenv";
dotenv.config();
import { config } from "./config";

import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routers";
import { pool } from "./helpers/db";
import session from "express-session";
import RedisStore from "connect-redis";
import { redisClient } from "./helpers/redis-client";
import { sessionMiddleware } from "./helpers/sessionMiddleware";
import {
  getFriendInfos,
  listenEvent,
  socketAuthorMiddleware,
} from "./middleware/socketAuth.middleware";

//  db
pool.getConnection().then(() => {
  console.log("connected to db.");
});

// redis
redisClient.connect().then(() => {
  console.log("connected to redis.");
});

//  app
const app = express();
const server = createServer(app);

const corsConfig = {
  origin: [config.CLIENT_URL],
  credentials: true,
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(helmet());
app.use(sessionMiddleware);

app.set("trust proxy", 1);

// route
app.get("/", (req, res) => {
  res.send("hi");
});
app.use("/auth", authRouter);

// socket
const io = new Server(server, { cors: corsConfig });

io.use((socket, next) => {
  (sessionMiddleware as any)(socket.request, {}, next);
});
io.use(socketAuthorMiddleware);

io.on("connect", async (socket) => {
  const user: any = (socket as any).user;

  // online
  await redisClient.hSet(`userid:${user.username}`, "connected", 1);

  // noti to friends
  const rawFriends = await redisClient.lRange(
    `friends:${user.username}`,
    0,
    -1
  );
  const friends = await getFriendInfos(rawFriends);

  if (friends.length)
    socket
      .to(friends.map((f) => f.userid))
      .emit("connected", true, user.username);

  // join room
  socket.join(user.userid);

  listenEvent(socket);
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000...");
});
