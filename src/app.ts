import express from "express";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "./auth/auth.routes.js";
import { AppError } from "./utils/AppError.js";
import { errorHandler } from "./middlewares/common/errorHandler.js";

const app = express(); // create an express app

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

// 404 handler
app.all("{/*path}", (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
});

// Global error handler (MUST BE LAST)
app.use(errorHandler);

export default app;
