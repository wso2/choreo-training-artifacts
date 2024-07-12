import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Database connection details
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"), // Default port is 5432 if DB_PORT is not defined
  ssl: {
    rejectUnauthorized: false,
  },
});

// Function to acquire a client from the pool
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

// Export the pool for direct query execution if needed
export default pool;
