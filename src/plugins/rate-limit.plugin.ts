import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyRequest, FastifyReply, FastifyInstance as FastifyInstanceType } from "fastify";

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

type Counter = {
  count: number;
  resetAt: number;
};

/**
 * Simple in-memory rate limiter to guard the edge.
 * Replace with a distributed implementation (e.g., Redis) for multi-instance deployments.
 */
export const rateLimitPlugin: FastifyPluginAsync<RateLimitOptions> = fp(
  async (app: FastifyInstanceType, opts: RateLimitOptions) => {
    const buckets = new Map<string, Counter>();

    app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
      const ip = request.ip;
      const now = Date.now();
      const bucket = buckets.get(ip);

      if (!bucket || bucket.resetAt < now) {
        buckets.set(ip, { count: 1, resetAt: now + opts.windowMs });
        return;
      }

      if (bucket.count >= opts.max) {
        reply.status(429).send({
          error: "Too Many Requests",
          message: "Rate limit exceeded",
        });
        return;
      }

      bucket.count += 1;
    });
  },
);
