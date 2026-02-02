type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | "trace";

type LoggerInstance = {
  debug: (message: string, meta?: unknown) => void;
  info: (message: string, meta?: unknown) => void;
  warn: (message: string, meta?: unknown) => void;
  error: (message: string, meta?: unknown) => void;
  fatal: (message: string, meta?: unknown) => void;
  trace: (message: string, meta?: unknown) => void;
  child: (bindings: Record<string, unknown>) => LoggerInstance;
};

/**
 * Fastify-compatible logger interface.
 * Must implement fatal, trace, and child methods for Fastify integration.
 */
class Logger {
  instance: LoggerInstance = {
    debug: this.debug.bind(this),
    info: this.info.bind(this),
    warn: this.warn.bind(this),
    error: this.error.bind(this),
    fatal: this.fatal.bind(this),
    trace: this.trace.bind(this),
    child: this.child.bind(this),
  };

  debug(message: string, meta?: unknown): void {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.log("error", message, meta);
  }

  fatal(message: string, meta?: unknown): void {
    this.log("error", message, meta); // Map fatal to error level
  }

  trace(message: string, meta?: unknown): void {
    this.log("debug", message, meta); // Map trace to debug level
  }

  /**
   * Creates a child logger with additional context.
   * Fastify uses this to add request context to logs.
   */
  child(bindings: Record<string, unknown>): LoggerInstance {
    // Create a child logger that enriches all logs with bindings
    const createChildLogger = (parentBindings: Record<string, unknown>): LoggerInstance => {
      const logWithBindings = (level: LogLevel, message: string, meta?: unknown): void => {
        const enrichedMeta = { ...parentBindings, ...(meta as Record<string, unknown>) };
        this.log(level, message, enrichedMeta);
      };

      return {
        debug: (message: string, meta?: unknown) => logWithBindings("debug", message, meta),
        info: (message: string, meta?: unknown) => logWithBindings("info", message, meta),
        warn: (message: string, meta?: unknown) => logWithBindings("warn", message, meta),
        error: (message: string, meta?: unknown) => logWithBindings("error", message, meta),
        fatal: (message: string, meta?: unknown) => logWithBindings("error", message, meta),
        trace: (message: string, meta?: unknown) => logWithBindings("debug", message, meta),
        child: (newBindings: Record<string, unknown>) =>
          createChildLogger({ ...parentBindings, ...newBindings }),
      };
    };

    return createChildLogger(bindings);
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    const payload = meta
      ? `${message} | ${JSON.stringify(meta, null, 2)}`
      : message;
    // Map fatal to error, trace to debug for console
    const consoleLevel = level === "fatal" ? "error" : level === "trace" ? "debug" : level;
    // eslint-disable-next-line no-console
    console[consoleLevel](`[${new Date().toISOString()}] ${payload}`);
  }
}

export const logger = new Logger();
