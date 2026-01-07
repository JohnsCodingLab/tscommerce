import type { Request, Response, NextFunction } from "express";
import { TokenService } from "#modules/auth/token.service.js";
import { AppError } from "#shared/utils/AppError.js";
import { asyncHandler } from "#shared/utils/asyncHandler.js";
import type { UserRole } from "#generated/prisma/index.js";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Authentication Required", "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    // 1. Get the payload
    const payload = TokenService.verifyAccessToken(token);

    // 2. Narrow the type: Ensure sub and role are definitely strings
    if (!payload.sub || !payload.role) {
      throw AppError.unauthorized("Invalid Token Payload", "MALFORMED_TOKEN");
    }

    // 3. Assign to req.user (TS will now know these are strings)
    req.user = {
      id: payload.sub,
      role: payload.role as UserRole,
    };

    next();
  }
);
