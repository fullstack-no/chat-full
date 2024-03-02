import mysql from "mysql2/promise";
import { config } from "../config";

export const pool = mysql.createPool({
  database: config.DATABASE_NAME,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,

  multipleStatements: true,
});
