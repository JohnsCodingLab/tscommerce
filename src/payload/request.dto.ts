import { UserRole } from "../types/index.js";

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
