import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      // Use unknown for safety
      if (error instanceof ZodError) {
        // Zod uses .issues for the error array
        const details = error.issues.map((issue) => ({
          path: issue.path[issue.path.length - 1], // Gets the field name
          message: issue.message,
        }));

        return next(AppError.validation("Validation Failed"));
      }
      return next(error);
    }
  };
