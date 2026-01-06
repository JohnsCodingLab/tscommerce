import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js"; // Ensure path is correct
import { env } from "./env.js";

// 1. Setup the connection pool
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

// 2. Initialize the adapter
const adapter = new PrismaPg(pool);

// 3. IMPORTANT: You MUST pass the adapter here
export const prisma = new PrismaClient({
  adapter,
});

export default prisma;
