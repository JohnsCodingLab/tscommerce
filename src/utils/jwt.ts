import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IUser } from "../types/index.js";
import { randomUUID } from "crypto";

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
  const jti = randomUUID();
  return {
    token: jwt.sign({ sub: user._id, jti }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    }),
    jti,
  };
};

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; jti: string };
