import type { UserRole } from "#generated/prisma/index.js";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "#shared/utils/AppError.js";

export const checkRole = (allowedRoles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Attached by your verifyJWT middleware

    if (!user) {
      return next(AppError.unauthorized("Authentication required"));
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      return next(
        AppError.forbidden("You do not have permission to perform this action")
      );
    }

    next();
  };
};
