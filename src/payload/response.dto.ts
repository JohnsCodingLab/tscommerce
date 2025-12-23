/* ----------- Responses ----------- */

import type { UserRole } from "../types/index.js";

export interface UserResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface TokenResponseDTO {
  accessToken: string;
}

export interface RefreshResponseDTO {
  accessToken: string;
}
