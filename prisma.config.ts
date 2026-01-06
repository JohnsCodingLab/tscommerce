import "dotenv/config";
import { env } from "./src/config/env.js";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
