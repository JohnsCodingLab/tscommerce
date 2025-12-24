import { email } from "zod";
import { User } from "../models/user.model.js";
import type {
  LoginRequestDTO,
  RegisterUserDTO,
} from "../payload/request.dto.js";
import type {
  AuthResponseDTO,
  UserResponseDTO,
} from "../payload/response.dto.js";
import type { IUser } from "../types/index.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/Logger.js";
import { TokenService } from "./token.service.js";

export class AuthService {
  // Register Neew User
  static async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      throw AppError.conflict(
        "User with this email already exist",
        "EMAIL_EXIST"
      );
    }
    const user = await User.create(data);
    logger.info(`New user registered: ${user.email}`);
    const tokens = await this.issueTokens(user);
    return { user: this.sanitizeUser(user), token: tokens };
  }

  //   Login User
  static async login(
    data: LoginRequestDTO,
    metadata?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthResponseDTO> {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(data.password))) {
      throw AppError.unauthorized(
        "Invalid email or password",
        "INVALID_CREDENTIALS"
      );
    }

    if (!user.isActive) {
      throw AppError.forbidden("Account is deactivated", "ACCOUNT_DEACTIVATED");
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = await this.issueTokens(user, metadata);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      token: tokens,
    };
  }

  // ----------------- Helpers ------------------

  private static async issueTokens(
    user: IUser,
    metadata?: { ipAddress?: string; userAgent?: string }
  ) {
    const accessToken = TokenService.generateAccessToken(user._id, user.role);

    const { refreshToken, jti } = TokenService.generateRefreshToken(user._id);

    await TokenService.saveRefreshToken(refreshToken, user._id, jti, metadata);

    return { accessToken, refreshToken };
  }

  private static sanitizeUser(user: IUser): UserResponseDTO {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
