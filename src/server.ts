import { buildApp } from "./app";
import { config } from "./config";

const startServer = async (): Promise<void> => {
  const app = buildApp();

  try {
    await app.listen({ port: config.env.PORT, host: "0.0.0.0" });
    app.log.info(`Server listening on port ${config.env.PORT}`);

    /**
     * Graceful shutdown:
     * - Stop accepting new connections
     * - Let in-flight requests finish
     * - Close the Fastify instance cleanly
     */
    const shutdown = async (signal: "SIGINT" | "SIGTERM"): Promise<void> => {
      app.log.info(`Received ${signal}, starting graceful shutdown...`);

      const shutdownTimeoutMs = 10_000;
      const timeout = setTimeout(() => {
        app.log.error("Graceful shutdown timed out, exiting forcefully");
        process.exit(1);
      }, shutdownTimeoutMs);

      try {
        await app.close();
        clearTimeout(timeout);
        app.log.info("Graceful shutdown complete");
        process.exit(0);
      } catch (error) {
        clearTimeout(timeout);
        app.log.error("Graceful shutdown failed", error as Error);
        process.exit(1);
      }
    };

    process.once("SIGINT", () => void shutdown("SIGINT"));
    process.once("SIGTERM", () => void shutdown("SIGTERM"));
  } catch (err) {
    app.log.error("Failed to start server", err as Error);
    process.exit(1);
  }
};

void startServer();
