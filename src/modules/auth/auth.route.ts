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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & authorization
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
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
