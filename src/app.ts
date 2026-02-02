import fastify, { FastifyInstance } from "fastify";
import { registerPlugins } from "./plugins";
import { registerUserRoutes } from "./modules/user/user.routes";
import { registerFieldsRoutes } from "./modules/fields/fields.routes";
import { registerErrorMiddleware } from "./middlewares/error.middleware";
import { config } from "./config";
import { z } from "zod";

/**
 * Builds and configures the Fastify application.
 * Only wiring and composition live here—no business logic.
 */
export const buildApp = (): FastifyInstance => {
  const app = fastify({
    /**
     * Fastify v5 expects `logger` to be `boolean` or a pino configuration object.
     * We use Fastify's built-in logger and rely on `app.log` everywhere.
     */
    logger: { level: "info" },
    disableRequestLogging: false,
    trustProxy: true,
  });

  registerPlugins(app, config);
  registerErrorMiddleware(app, app.log);

  /**
   * Health check endpoint for load balancers / k8s liveness probes.
   * Keep it cheap: no downstream calls, no module dependencies.
   */
  const healthResponseSchema = z.object({
    status: z.literal("ok"),
    service: z.string(),
    version: z.string(),
    timestamp: z.string(),
  });
  app.get("/health", async (_request, reply) => {
    const payload = healthResponseSchema.parse({
      status: "ok",
      service: config.constants.APP_NAME,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
    reply.status(200).send(payload);
  });

  // Route registration is feature-first; add new modules here.
  registerUserRoutes(app, config);
  registerFieldsRoutes(app);

  return app;
};
