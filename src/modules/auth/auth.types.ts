import type { UserRole } from "#generated/prisma/index.js";

export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface TokenResponseDTO {
  accessToken: string;
}

export interface OAuthProfile {
  provider: "google" | "github" | "discord" | "apple";
  providerId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // avatarUrl?: string;
}
