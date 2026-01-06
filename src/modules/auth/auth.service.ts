import { prisma } from "../../config/prisma.js";
import { TokenService } from "./token.service.js";
import { hashPassword, comparePassword } from "../../shared/utils/password.js";
import { AppError } from "../../shared/utils/AppError.js";
import type {
  RegisterUserDTO,
  LoginUserDTO,
  AuthResponseDTO,
  UserResponseDTO,
} from "./auth.types.js";

export class AuthService {
  // Register user
  static async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
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

    const tokens = await this.issueTokens(user.id, user.role);

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
      throw AppError.unauthorized("Invalid credentials");
    }

    if (!user.isActive) {
      throw AppError.forbidden("Account disabled");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.issueTokens(user.id, user.role, meta);

    return {
      user: this.sanitize(user),
      tokens,
    };
  }

  //   Refresh Access Token
  static async refresh(refreshToken: string) {
    const payload = await TokenService.verifyRefreshToken(refreshToken);

    await TokenService.revokeRefreshToken(payload.jti);

    const accessToken = TokenService.generateAccessToken(payload.sub, "BUYER");

    return { accessToken };
  }

  //   Logout User
  static async logout(refreshToken: string) {
    const payload = await TokenService.verifyRefreshToken(refreshToken);
    await TokenService.revokeRefreshToken(payload.jti);
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
