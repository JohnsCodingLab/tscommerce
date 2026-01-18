import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_EXPIRATION: z.string().default("7d"),

  // Google client
  GOOGLE_CLIENT_ID: z.string().min(1, "Google client is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google client secret is required"),
  GOOGLE_CALLBACK_URL: z.string().min(1, "Google callback url is required"),
});

// parse() throws an error and stops the app if validation fails.
// This is better than safeParse for critical infrastructure like Env.
export const env = envSchema.parse(process.env);

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
