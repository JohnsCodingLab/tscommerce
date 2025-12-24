import express from "express";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes.js";
import { AppError } from "./utils/AppError.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express(); // create an express app

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);

// 404 handler
app.all("{/*path}", (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
});

// Global error handler (MUST BE LAST)
app.use(errorHandler);

export default app;
