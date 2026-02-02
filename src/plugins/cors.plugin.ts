import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

/**
 * Minimal CORS plugin without external dependencies.
 * Adjust allowed origins as needed for your deployment.
 */
export const corsPlugin: FastifyPluginAsync = fp(async (app) => {
  const allowedOrigins = ["*"];

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin || "*";
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
    }
    reply.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-user-id, x-user-roles",
    );
    reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    reply.header("Access-Control-Allow-Credentials", "true");

    if (request.method === "OPTIONS") {
      return reply.status(204).send();
    }
  });
});
