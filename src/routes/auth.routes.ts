import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               firstName:
 *                  type: string
 *                  example: john
 *               lastName:
 *                  type: string
 *                  example: doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", validate, register);

export default router;
