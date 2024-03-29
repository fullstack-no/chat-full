export const config = {
  ENVIRONMENT: process.env.ENVIRONMENT || "dev",

  // client
  CLIENT_URL: process.env.CLIENT_URL || "",

  // db
  DATABASE_NAME: process.env.DATABASE_NAME || "",
  DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT as any, 10) || 3306,
  DATABASE_USER: process.env.DATABASE_USER || "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",

  // session
  SESSION_SECRET: process.env.SESSION_SECRET || "",
};
