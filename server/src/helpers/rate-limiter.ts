import { RequestHandler } from "express";
import { redisClient } from "./redis-client";
import { sendTwoManyRequests } from "./common";

export const rateLimiter: (
  timesLimit: number,
  secondsLimit: number
) => RequestHandler = (timesLimit, secondsLimit) => {
  return async (req, res, next) => {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    if (ip) {
      const [times] = await redisClient.multi().incr(ip).expire(ip, 10).exec();

      if (typeof times === "number" && times <= 3) {
        next();
        return;
      }

      sendTwoManyRequests(res);
      return;
    }

    next();
  };
};
