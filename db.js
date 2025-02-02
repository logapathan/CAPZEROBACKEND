import pkg from "pg";
import env from "dotenv";
const { Pool } = pkg;
env.config();

const pool = new Pool({
  user: process.env.SQL_USER,
  host: process.env.SQL_HOST,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  port: process.env.SQL_PORT,
});

export default pool;
