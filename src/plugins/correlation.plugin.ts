import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const correlationHeaderSchema = z.object({
  "x-correlation-id": z.string().min(1).optional(),
});

declare module "fastify" {
  interface FastifyRequest {
    /**
     * Correlation identifier used for log stitching and traceability across services.
     * Prefer accessing `request.correlationId` instead of reading raw headers.
     */
    correlationId: string;
  }
}

/**
 * Correlation ID plugin:
 * - Accepts `x-correlation-id` from the client if provided
 * - Otherwise generates a UUID
 * - Echoes it back on every response
 *
 * This is a BFF platform concern and should not live inside feature modules.
 */
export const correlationPlugin: FastifyPluginAsync = fp(async (app) => {
  app.addHook("onRequest", async (request, reply) => {
    const { "x-correlation-id": incoming } = correlationHeaderSchema.parse(
      request.headers,
    );
    const cid = incoming ?? randomUUID();
    request.correlationId = cid;
    reply.header("x-correlation-id", cid);
  });
});

