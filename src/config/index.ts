import { config } from "dotenv";
const dev = process.env.NODE_ENV !== "production";
config({ path: `.env.${dev ? "development" : process.env.NODE_ENV}` });
export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MONGODB_URI,
  BASE_URL,
} = process.env;
