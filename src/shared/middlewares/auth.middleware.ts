import type { Request, Response, NextFunction } from "express";
import { TokenService } from "#modules/auth/token.service.js";
import { AppError } from "#shared/utils/AppError.js";
import { asyncHandler } from "#shared/utils/asyncHandler.js";
import { UserRole } from "#generated/prisma/index.js";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Authentication Required", "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    const payload = TokenService.verifyAccessToken(token);

    req.user = TokenService.validatePayload(payload);

    next();
  }
);
