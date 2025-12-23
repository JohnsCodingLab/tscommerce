import { env, isDevelopment } from "../config/env.js";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    if (isDevelopment) {
      console[level === "error" ? "error" : "log"](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        meta || ""
      );
    } else {
      // In production, you'd send this to a logging service (DataDog, LogRocket, etc.)
      console.log(JSON.stringify(logMessage));
    }
  }

  info(message: string, meta?: unknown) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: unknown) {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: unknown) {
    if (isDevelopment) {
      this.log("debug", message, meta);
    }
  }
}

export const logger = new Logger();
