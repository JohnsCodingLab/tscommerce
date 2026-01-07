import jwt, { type SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { env } from "#config/env.js";
import prisma from "#config/prisma.js";
import { AppError } from "#shared/utils/AppError.js";

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
    const tokenHash = await bcrypt.hash(token, 12);
    const expiresAt = new Date(Date.now() + 7 * 86400000);

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
}
