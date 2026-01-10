import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "#shared/docs/openapi.js";

extendZodWithOpenApi(z);

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").trim(),
    password: z.string().min(8),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
});

registry.register("RegisterInput", registerSchema.shape.body);
registry.register("LoginInput", loginSchema.shape.body);
registry.register("RefreshInput", refreshSchema.shape.body);

export type RegisterUserDTO = z.infer<typeof registerSchema>["body"];
export type LoginUserDTO = z.infer<typeof loginSchema>["body"];
