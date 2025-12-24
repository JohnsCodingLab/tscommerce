import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";

// Register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.register(req.body);

  res.status(201).json({
    status: "success",
    data: data,
  });
});
