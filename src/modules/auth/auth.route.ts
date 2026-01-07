import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "#shared/middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validator.js";
import { authRateLimiter } from "#shared/middlewares/rateLimiter.middleware.js";
const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  AuthController.login
);

router.post("/refresh", validate(refreshSchema), AuthController.refreshToken);

router.post("/logout", validate(refreshSchema), AuthController.logout);

export default router;
