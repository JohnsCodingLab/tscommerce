import type { UserRole } from "#generated/prisma/index.js";

export interface ValidatedUser {
  id: string;
  role: UserRole;
}
