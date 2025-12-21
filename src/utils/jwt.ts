import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IUser } from "../types/user.js";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ sub: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
