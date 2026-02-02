import { FastifyInstance } from "fastify";
import type { FastifyBaseLogger } from "fastify";

type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};

export const registerErrorMiddleware = (
  app: FastifyInstance,
  log: FastifyBaseLogger,
): void => {
  app.setErrorHandler((error, _request, reply) => {
    log.error("Unhandled error", error);
    const statusCode = error.statusCode ?? 500;
    const response: ErrorResponse = {
      error: "Internal Server Error",
      message: statusCode < 500 ? error.message : "Something went wrong",
      statusCode,
    };
    reply.status(statusCode).send(response);
  });
};
