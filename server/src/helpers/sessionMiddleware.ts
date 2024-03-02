import session from "express-session";
import { config } from "../config";
import { redisClient } from "./redis-client";
import RedisStore from "connect-redis";

const sessionConfig = {
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient, prefix: "myapp:session:" }),

  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: config.ENVIRONMENT === "production",
    sameSite: config.ENVIRONMENT === "production" ? "none" : "lax",
  },
};

export const sessionMiddleware = session(sessionConfig as any);
