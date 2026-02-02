import { FastifyInstance } from "fastify";
import { Config } from "./types";
import { authPlugin } from "./auth.plugin";
import { correlationPlugin } from "./correlation.plugin";
import { corsPlugin } from "./cors.plugin";
import { rateLimitPlugin } from "./rate-limit.plugin";
import { swaggerPlugin } from "./swagger.plugin";

export const registerPlugins = (app: FastifyInstance, cfg: Config): void => {
  app.register(correlationPlugin);
  app.register(corsPlugin);
  app.register(rateLimitPlugin, {
    max: cfg.constants.RATE_LIMIT_MAX_REQUESTS,
    windowMs: cfg.constants.RATE_LIMIT_WINDOW_MS,
  });
  app.register(authPlugin);
  app.register(swaggerPlugin, {
    enabled: cfg.env.ENABLE_DOCS,
    title: cfg.constants.APP_NAME,
    version: "1.0.0",
  });
};
