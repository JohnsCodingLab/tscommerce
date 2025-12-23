import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { REFRESH_TOKEN_TTL_DAYS } from "../constants/index.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../types/index.js";
import { logger } from "../utils/Logger.js";

interface TokenMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export class TokenService {
  // Generate Access Token
  static generateAccessToken(userId: string, role: UserRole): string {
    const accessToken = jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });
    return accessToken;
  }

  // Generate Refresh Token
  static generateRefreshToken(userId: string): {
    refreshToken: string;
    jti: string;
  } {
    const jti = randomUUID();
    const refreshToken = jwt.sign(
      { sub: userId, jti },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRATION as any }
    );
    return { refreshToken, jti };
  }

  // save refresh Token to database
  static async saveRefreshToken(
    token: string,
    userId: string,
    jti: string,
    metadata?: TokenMetadata
  ) {
    const tokenHash = await bcrypt.hash(token, 12);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 86400000); // seven days

    await RefreshToken.create({
      user: userId,
      jti,
      tokenHash,
      expiresAt,
      ...metadata,
    });

    logger.debug(`Refresh token saved for user: ${userId}`);
  }

  // Verify Access Token
  static verifyAccessToken(token: string): { sub: string; role: UserRole } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as {
        sub: string;
        role: UserRole;
      };
    } catch (error) {
      logger.error("Access token verification failed", error);
      throw AppError.unauthorized("Invalid or expired access token");
    }
  }

  // Verify Refresh Token
  static async verifyRefreshToken(
    token: string
  ): Promise<{ sub: string; jti: string }> {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        sub: string;
        jti: string;
      };

      // Check if token exists in database
      const storedToken = await RefreshToken.findOne({
        jti: payload.jti,
        user: payload.sub,
      });

      if (!storedToken) {
        throw AppError.unauthorized("Refresh token not found");
      }

      // Verify token hash
      const isValid = await bcrypt.compare(token, storedToken.tokenHash);
      if (!isValid) {
        throw AppError.unauthorized("Invalid refresh token");
      }

      return payload;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Refresh token verification failed", error);
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  }

  // Revoke Refresh Token
  static async revokeRefreshToken(jti: string) {
    await RefreshToken.deleteOne({ jti });
    logger.debug(`Refresh token revoked: ${jti}`);
  }

  // Revoke All User Tokens
  static async revokeAllUserTokens(userId: string) {
    await RefreshToken.deleteMany({ user: userId });
    logger.info(`All refresh tokens revoked for user: ${userId}`);
  }

  // Cleanup Expired Tokens (can be run as a cron job)
  static async cleanupExpiredTokens() {
    const result = await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    logger.info(`Cleaned up ${result.deletedCount} expired tokens`);
  }
}
