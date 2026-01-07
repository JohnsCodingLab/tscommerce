import { AuthService } from "./auth.service.js";
import { asyncHandler } from "#shared/utils/asyncHandler.js";
import type { LoginUserDTO, RegisterUserDTO } from "./auth.validator.js";

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body as RegisterUserDTO);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body as LoginUserDTO, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
  res.status(200).json(result);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await AuthService.refresh(
    req.body.refreshToken
    // {
    //   ipAddress: req.ip,
    //   userAgent: req.headers["user-agent"],
    // }
  );
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.body.refreshToken);
  res.status(204).send();
});
