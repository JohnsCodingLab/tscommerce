import { UserRole } from "../types/user.js";

/* ----------- Requests ----------- */

export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}
