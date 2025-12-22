/* ----------- Responses ----------- */

import type { UserRole } from "../types/user.js";

export interface AuthUserResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponseDTO {
  user: AuthUserResponseDTO;
  accessToken: string;
}

export interface RefreshResponseDTO {
  accessToken: String;
}
