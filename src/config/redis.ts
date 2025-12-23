// import { createClient } from "redis";
// import { env } from "./env.js";
// import { logger } from "../utils/logger.js";

// let redisClient: ReturnType | null = null;

// export const connectRedis = async () => {
//   if (!env.REDIS_URL) {
//     logger.warn("Redis URL not provided. Token blacklisting will be disabled.");
//     return null;
//   }

//   try {
//     redisClient = createClient({ url: env.REDIS_URL });

//     redisClient.on("error", (err) => logger.error("Redis Client Error", err));
//     redisClient.on("connect", () => logger.info("Redis connected"));

//     await redisClient.connect();
//     return redisClient;
//   } catch (error) {
//     logger.error("Redis connection failed:", error);
//     return null;
//   }
// };

// export const getRedisClient = () => redisClient;
