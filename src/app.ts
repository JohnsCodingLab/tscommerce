import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "#shared/middlewares/errorHandler.js";
import { AppError } from "#shared/utils/AppError.js";

import authRouter from "#modules/auth/auth.route.js";

const app = express(); // create an express app

// MiddleWares
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3001", // your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);

// routes
app.get("/", (req, res) => {
  res.redirect("/docs");
});

// 404 handler
app.all("{/*path}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (MUST BE LAST)
app.use(errorHandler);

export default app;
