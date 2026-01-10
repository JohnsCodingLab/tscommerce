import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "#shared/middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validator.js";
import { authRateLimiter } from "#shared/middlewares/rateLimiter.middleware.js";
import { registry } from "#shared/docs/openapi.js";

const router = Router();

registry.registerPath({
  method: "post",
  path: "/auth/register",
  summary: "Register a new user",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
    },
    409: {
      description: "Email already exists",
    },
  },
});

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  AuthController.register
);

registry.registerPath({
  method: "post",
  path: "api/v1/auth/login",
  summary: "Login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login Successfull",
    },
  },
});

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  AuthController.login
);

// refresh token
registry.registerPath({
  method: "post",
  path: "api/v1/auth/refresh",
  summary: "Refresh Access Token",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User registered successfully",
    },
  },
});
router.post("/refresh", validate(refreshSchema), AuthController.refreshToken);

// refresh token
registry.registerPath({
  method: "post",
  path: "api/v1/auth/logout",
  summary: "Logout",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Logout Successfull",
    },
  },
});
router.post("/logout", validate(refreshSchema), AuthController.logout);

export default router;
