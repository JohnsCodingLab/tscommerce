import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/utils/AppError.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Known (operational) error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unknown error (programmer error)
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};
