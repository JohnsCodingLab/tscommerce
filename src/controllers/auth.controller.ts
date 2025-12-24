import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
import { env } from "../config/env.js";

// Register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.register(req.body);

  res.status(201).json({
    status: "success",
    data: data,
  });
});

// Login User
export const login = asyncHandler(async (req: Request, res: Response) => {
  const metadata = {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  };

  const data = await AuthService.login(req.body);

  // store refresh token in httpOnly cookie
  res.cookie("refreshToken", data.token.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    data: {
      user: data.user,
      accessToken: data.token.accessToken,
    },
  });
});
