import { Socket } from "socket.io";
import { redisClient } from "../helpers/redis-client";

export const socketAuthorMiddleware = (socket: any, next: any) => {
  if (!socket.request?.session?.user?.username) {
    next(new Error("Unauthorized"));
  } else {
    socket.user = socket.request.session.user;

    redisClient.hSet(
      `userid:${socket.request.session.user.username}`,
      "userid",
      socket.user.userid
    );

    next();
  }
};

export const listenEvent = (socket: Socket) => {
  socket.on("disconnecting", async (reason) => {
    try {
      const user = (socket as any).user;
      await redisClient.hSet(`userid:${user.username}`, "connected", 0);
      // get friends
      const rawFriends = await redisClient.lRange(
        `friends:${user.username}`,
        0,
        -1
      );

      const friends = await getFriendInfos(rawFriends);

      //  emit to friends that we are offline
      if (friends.length)
        socket
          .to(friends.map((f) => f.userid))
          .emit("connected", false, user.username);
    } catch (error) {
      console.log("error: socket disconnecting");
      console.log(error);
    }
  });

  socket.on("add_friend", async (friendname, cb) => {
    try {
      if (friendname === (socket as any).user.username) {
        cb({ done: false, errorMsg: "You can't add yourself" });
        return;
      }

      const friend = await redisClient.hGetAll(`userid:${friendname}`);
      console.log("friend", friend);

      if (!friend.userid) {
        cb({ done: false, errorMsg: "Username is not exist" });
        return;
      }

      const currentFriendList = await redisClient.lRange(
        `friends:${(socket as any).user.username}`,
        0,
        -1
      );

      if (currentFriendList && currentFriendList.indexOf(friendname) !== -1) {
        cb({ done: false, errorMsg: "Friend already added!" });
        return;
      }

      await redisClient.lPush(
        `friends:${(socket as any).user.username}`,
        JSON.stringify([friendname, friend.userid])
      );
      cb({
        done: true,
        friend: {
          userid: friend.userid,
          username: friendname,
          connected: friend.connected,
        },
      });
    } catch (err) {
      console.log(err);

      cb({ done: false, errorMsg: "Server errors" });
    }
  });

  socket.on("friends", async (cb) => {
    const user = (socket as any).user;
    const rawFriends = await redisClient.lRange(
      `friends:${user.username}`,
      0,
      -1
    );

    const friends = await getFriendInfos(rawFriends);

    cb(friends);
  });

  socket.on("messages", async () => {
    try {
      const messages = await redisClient.lRange(
        `chat:${(socket as any).user.userid}`,
        0,
        -1
      );

      socket.emit(
        "messages",
        messages.map((message) => JSON.parse(message))
      );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("dm", async (message) => {
    try {
      const user = (socket as any).user;
      message.from = user.userid;

      const messsageString = JSON.stringify(message);

      await redisClient.lPush(`chat:${message.to}`, messsageString);
      await redisClient.lPush(`chat:${message.from}`, messsageString);

      socket.to(message.to).emit("dm", message);
    } catch (error) {
      console.log(error);
    }
  });
};

// parse and get full friends info
export const getFriendInfos = async (friends: any[]) => {
  const friendsInfo: any[] = [];

  for (let friend of friends) {
    const [username, userid] = JSON.parse(friend);

    const f = { username, userid, connected: false };
    const userConnected = await redisClient.hGet(
      `userid:${f.username}`,
      "connected"
    );
    f.connected = Boolean(Number(userConnected));
    friendsInfo.push(f);
  }

  return friendsInfo;
};
