import { isDevelopment } from "../../config/env.js";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();

    // const logMessage = {
    //   timestamp,
    //   level,
    //   message,
    //   ...(meta && { meta }),
    // };

    if (isDevelopment) {
      // Map levels to console methods to ensure they show up in your terminal
      const consoleMethod =
        level === "debug"
          ? "debug"
          : level === "error"
          ? "error"
          : level === "warn"
          ? "warn"
          : "log";

      console[consoleMethod](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        meta !== undefined ? meta : ""
      );
    } else {
      // Production JSON logging
      console.log(JSON.stringify({ timestamp, level, message, meta }));
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
