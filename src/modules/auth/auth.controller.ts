import { AuthService } from "./auth.service.js";
import { asyncHandler } from "#shared/utils/asyncHandler.js";
import type { LoginUserDTO, RegisterUserDTO } from "./auth.validator.js";
import { AppError } from "#shared/utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body as RegisterUserDTO);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body as LoginUserDTO, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user: result.user,
    accessToken: result.tokens.accessToken,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await AuthService.refresh(refreshToken, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", result.tokens.refreshToken, {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    accessToken: result.tokens.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await AuthService.logout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(204).send();
});
