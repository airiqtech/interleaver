import { buildApp } from "./src/app";
import { config } from "./src/config";
import { logger } from "./src/core/logger/logger";

const startServer = async (): Promise<void> => {
  const app = buildApp();

  try {
    await app.listen({ port: config.env.PORT, host: "0.0.0.0" });
    logger.info(`Server listening on port ${config.env.PORT}`);
  } catch (err) {
    logger.error("Failed to start server", err as Error);
    process.exit(1);
  }
};

void startServer();
