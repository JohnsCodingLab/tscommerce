import { AppError } from "./AppError.js";

export function requireOAuthEmail(email?: string, provider?: string): string {
  if (!email) {
    throw AppError.badRequest(`${provider ?? "OAuth"} account has no email`);
  }
  return email;
}
