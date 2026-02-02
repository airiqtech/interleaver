import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyInstance as FastifyInstanceType } from "fastify";

type SwaggerOptions = {
  enabled: boolean | string | undefined;
  title: string;
  version: string;
};

/**
 * Swagger/OpenAPI plugin.
 * Uses optional dependencies; if missing, the app still boots without docs.
 */
export const swaggerPlugin: FastifyPluginAsync<SwaggerOptions> = fp(
  async (app: FastifyInstanceType, opts: SwaggerOptions): Promise<void> => {
    const shouldEnable = opts.enabled === true || opts.enabled === "true";
    if (!shouldEnable) {
      app.log.info("Swagger docs disabled");
      return;
    }

    try {
      const { default: swagger } = await import("@fastify/swagger");
      const { default: swaggerUi } = await import("@fastify/swagger-ui");

      await app.register(swagger, {
        openapi: {
          info: { title: opts.title, version: opts.version },
        },
      });

      await app.register(swaggerUi, {
        routePrefix: "/docs",
      });
    } catch (error) {
      app.log.warn("Swagger plugins not installed, skipping docs");
      app.log.debug(error);
    }
  },
);
