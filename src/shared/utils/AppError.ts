export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: String;

  constructor(message: string, statusCode = 500, code?: String) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string) {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = "Unauthorized", code?: string) {
    return new AppError(message, 401, code);
  }

  static forbidden(message = "Forbidden", code?: string) {
    return new AppError(message, 403, code);
  }

  static notFound(message = "Resource not found", code?: string) {
    return new AppError(message, 404, code);
  }

  static conflict(message: string, code?: string) {
    return new AppError(message, 409, code);
  }

  static validation(message: string, code?: string) {
    return new AppError(message, 422, code); // 422 Unprocessable Entity
  }

  static internal(message = "Internal server error", code?: string) {
    return new AppError(message, 500, code);
  }
}
