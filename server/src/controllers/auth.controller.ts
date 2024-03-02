import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { v4 } from "uuid";
import {
  sendBadRequestResponse,
  sendServerErrorResponse,
} from "../helpers/common";
import { pool } from "../helpers/db";
import { encryption } from "../helpers/encryption";

export const authController = {
  register: async (req: Request, res: Response, data: any) => {
    try {
      const { username, password } = data;

      const [[existingUser]] = await pool.query<RowDataPacket[]>(
        "SELECT username FROM users WHERE username = ?",
        [username]
      );

      if (existingUser) {
        sendBadRequestResponse(res, "Username is existed");
        return;
      }

      const hashedPassword = await encryption.hash(password);

      const [[result, [user]]]: any = await pool.query(
        `
        INSERT INTO users(username, password, userid) VALUES (?,?,?);
        SELECT *
        FROM users
         WHERE username = ?;
        `,

        [username, hashedPassword, v4(), username]
      );
      if (!result?.affectedRows) {
        sendBadRequestResponse(res, "Username is existed");
        return;
      }

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        userid: user.userid,
      };

      res.json({ login: true, username });
    } catch (error) {
      console.log(error);

      sendServerErrorResponse(res, undefined);
    }
  },

  login: async (req: Request, res: Response, data: any) => {
    try {
      const { username, password } = data;
      const [[user]] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      if (!user) {
        res.json({ login: false, status: "username or password wrong" });
        return;
      }

      const passCheck = await encryption.compare(password, user.password);
      if (!passCheck) {
        res.json({ login: false, status: "username or password wrong" });
        return;
      }

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        userid: user.userid,
      };

      res.json({ login: true, username, id: user.id });
    } catch (error) {
      console.log(error);

      sendServerErrorResponse(res, undefined);
    }
  },
};
