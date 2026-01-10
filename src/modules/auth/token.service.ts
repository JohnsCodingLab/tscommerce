import jwt, { type SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { env } from "#config/env.js";
import prisma from "#config/prisma.js";
import { AppError } from "#shared/utils/AppError.js";
import { hashPassword } from "#shared/utils/password.js";
import ms, { type StringValue } from "ms";
import type { ValidatedUser } from "#shared/types/index.js";
import { UserRole } from "#generated/prisma/index.js";

export class TokenService {
  // Generate access token
  static generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION,
    } as SignOptions);
  }

  //   Generate refresh token
  static generateRefreshToken(userId: string) {
    const jti = randomUUID();

    const token = jwt.sign({ sub: userId, jti }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION,
    } as SignOptions);

    return { token, jti };
  }

  //   Save refresh token to db
  static async saveRefreshToken(
    token: string,
    userId: string,
    jti: string,
    meta?: { ipAddress?: string; userAgent?: string }
  ) {
    const tokenHash = await hashPassword(token);

    const expireInMs = ms(env.JWT_REFRESH_EXPIRATION as StringValue);
    const expiresAt = new Date(Date.now() + expireInMs);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        expiresAt,
        userId,
        ...meta,
      },
    });
  }

  // verify access token
  static verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Type Narrowing: Check if it's an object and has our properties
    if (typeof decoded === "string" || !decoded.sub || !decoded.role) {
      throw AppError.unauthorized("Invalid token payload");
    }

    return decoded;
  }

  //   Verify Refresh Token
  static async verifyRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        sub: string;
        jti: string;
      };

      const stored = await prisma.refreshToken.findUnique({
        where: { jti: payload.jti },
      });

      if (!stored) {
        throw AppError.unauthorized("Refresh token revoked");
      }

      const valid = await bcrypt.compare(token, stored.tokenHash);
      if (!valid) {
        throw AppError.unauthorized("Invalid refresh token");
      }

      return payload;
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  }

  //   Revoke refresh Token
  static async revokeRefreshToken(jti: string) {
    await prisma.refreshToken.delete({ where: { jti } });
  }

  //   Revoke All user tokens
  static async revokeAllUserTokens(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  /**
   * Validates the raw JWT payload and transforms it into a typed object.
   * This removes the need for unsafe casting in middlewares.
   */
  static validatePayload(payload: any): ValidatedUser {
    if (!payload?.sub || !payload?.role) {
      throw AppError.unauthorized("Invalid token payload structure");
    }

    const roleValue = payload.role as UserRole;
    if (!Object.values(UserRole).includes(roleValue)) {
      throw AppError.forbidden("Token contains an unrecognized user role");
    }

    return {
      id: payload.sub,
      role: roleValue,
    };
  }
}
