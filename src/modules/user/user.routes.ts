import { FastifyInstance, FastifyRequest } from "fastify";
import { Config } from "../../plugins/types";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserClient } from "../../clients/user.client";

/**
 * Feature-first router; only wires HTTP to controllers.
 */
export const registerUserRoutes = (
  app: FastifyInstance,
  cfg: Config,
): void => {
  const userClient = new UserClient(cfg.env.USER_SERVICE_BASE_URL);
  const userService = new UserService(userClient);
  const controller = new UserController(userService);

  app.post<{ Body: { fvType: string, groupName: string, userId: string } }>("/fields", async (request, reply) =>
    controller.getFields(request as FastifyRequest<{ Body: { fvType: string, groupName: string, userId: string } }>, reply),
  );
  app.post<{ Body: { fvType: string, groupName: string, cartId: string } }>("/cartlist", async (request, reply) =>
    controller.getCartList(request as FastifyRequest<{ Body: { fvType: string, groupName: string, cartId: string } }>, reply),
  );
};
