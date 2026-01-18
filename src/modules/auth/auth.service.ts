import prisma from "#config/prisma.js";
import { AppError } from "#shared/utils/AppError.js";
import { logger } from "#shared/utils/Logger.js";
import { comparePassword, hashPassword } from "#shared/utils/password.js";
import type { AuthResponseDTO, UserResponseDTO } from "./auth.types.js";
import type { LoginUserDTO, RegisterUserDTO } from "./auth.validator.js";
import { TokenService } from "./token.service.js";

export class AuthService {
  // Register user
  static async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      logger.warn(`User with email ${existing.email} already exist`);
      throw AppError.conflict("Email already in use");
    }

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: await hashPassword(data.password),
      },
    });
    logger.info(`user registered succesffully ${user}`);

    const tokens = await this.issueTokens(user.id, user.role);
    logger.info(`issued toker for user with id: ${user.id}`);

    return {
      user: this.sanitize(user),
      tokens,
    };
  }

  //   Login
  static async login(
    data: LoginUserDTO,
    meta?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthResponseDTO> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      logger.warn(`Login failed: User not found for email ${data.email}`);
      throw AppError.unauthorized("Invalid credentials");
    }

    if (!user.isActive) {
      logger.warn(`Login failed: Incorrect password for UID ${user.id}`);
      throw AppError.forbidden("Account disabled");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.debug(`Issuing new token set for UID ${user.id}`);
    const tokens = await this.issueTokens(user.id, user.role, meta);

    return {
      user: this.sanitize(user),
      tokens,
    };
  }

  //   Refresh Access Token
  static async refresh(
    refreshToken: string,
    meta?: { ipAddress?: string; userAgent?: string }
  ) {
    if (!refreshToken) {
      logger.warn(`No refresh  token provided`);
      throw AppError.unauthorized("No refresh token provided");
    }

    const payload = await TokenService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      logger.warn(`User not found or no longer exist`);
      throw AppError.unauthorized("User no longer exists");
    }

    if (!user.isActive) {
      logger.warn(`User account is disabled`);
      throw AppError.forbidden("Account disabled");
    }

    await TokenService.revokeRefreshToken(payload.jti);

    const tokens = await this.issueTokens(user.id, user.role, meta);
    logger.info(`Tokens issued successfully`);

    return { tokens };
  }

  //   Logout User
  static async logout(refreshToken: string) {
    if (!refreshToken) {
      logger.warn("No refresh token provided");
      throw AppError.unauthorized("No refresh token provided");
    }

    const payload = await TokenService.verifyRefreshToken(refreshToken);
    await TokenService.revokeAllUserTokens(payload.sub);
  }

  //   Issue tokens to user
  private static async issueTokens(
    userId: string,
    role: string,
    meta?: { ipAddress?: string; userAgent?: string }
  ) {
    const accessToken = TokenService.generateAccessToken(userId, role);
    const { token, jti } = TokenService.generateRefreshToken(userId);

    await TokenService.saveRefreshToken(token, userId, jti, meta);

    return { accessToken, refreshToken: token };
  }

  private static sanitize(user: any): UserResponseDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
