import type { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service.js";
import { User } from "../models/user.model.js";
import { AppError } from "../shared/utils/AppError.js";
import { UserRole } from "../types/index.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw AppError.unauthorized("No token provided", "NO_TOKEN");
    }

    const token = authHeader.substring(7);
    const payload = TokenService.verifyAccessToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw AppError.unauthorized("User not found", "USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw AppError.forbidden("Account is deactivated", "ACCOUNT_DEACTIVATED");
    }

    req.user = user;
    next();
  }
);

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden(
        "Insufficient permissions",
        "INSUFFICIENT_PERMISSIONS"
      );
    }

    next();
  };
};
