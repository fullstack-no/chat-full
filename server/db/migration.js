require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");

// const mysql = require("mysql2");

// const conn = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   port: process.env.DATABASE_PORT,
//   database: process.env.DATABASE_NAME,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
// });

// conn.query("CREATE TABLE")

async function run() {
  var mysql = require("mysql2");
  var migration = require("mysql-migrations");

  var connection = mysql.createPool({
    connectionLimit: 10,
    database: process.env.DATABASE_NAME || "",
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || "",
    password: process.env.DATABASE_PASSWORD || "",
  });

  const migrationDir = path.join(__dirname, "migrations");
  try {
    await fs.stat(migrationDir);
  } catch {
    await fs.mkdir(migrationDir);
    console.log("created migrations dir.");
  }

  migration.init(connection, __dirname + "/migrations", function () {
    console.log("finished running migrations");
  });
}

run();
