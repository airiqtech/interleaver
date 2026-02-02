import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const authHeaderSchema = z.object({
  "x-user-id": z.string().min(1).optional(),
  "x-user-roles": z.string().optional(),
});

export type AuthContext = {
  userId?: string;
  roles: string[];
};

declare module "fastify" {
  interface FastifyRequest {
    authContext?: AuthContext;
  }
}

/**
 * Lightweight auth plugin for the BFF.
 * It propagates user identity from incoming headers without enforcing
 * authorization logic (handled downstream).
 */
export const authPlugin: FastifyPluginAsync = fp(async (app) => {
  app.addHook("preHandler", async (request) => {
    const parsedHeaders = authHeaderSchema.parse(request.headers);
    request.authContext = {
      userId: parsedHeaders["x-user-id"],
      roles: parsedHeaders["x-user-roles"]
        ? parsedHeaders["x-user-roles"].split(",").map((role) => role.trim())
        : [],
    };
  });
});
