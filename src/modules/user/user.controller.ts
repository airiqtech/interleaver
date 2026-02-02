import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service";
import { getEntityPolicyFields } from "../../policies/fields.policy";
import { logger } from "../../core/logger/logger";

/**
 * Controllers own HTTP concerns: validation, status codes, and headers.
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  async getFields(
    request: FastifyRequest<{ Body: { fvType: string, groupName: string, userId: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
    if (!request.body) {
      return reply.status(200).send({ 
        success: false,
        message: "Request body is required. Ensure you're sending a POST request with Content-Type: application/json" 
      });
    }
    const { fvType, groupName, userId } = request.body;
    if(!fvType || !groupName) {
      return reply.status(200).send({ success: false, message: "Missing fvType or groupName" });
    }
    // const user = await this.userService.getUser(id.toString());
    const role=  "agent";
    const policyFields = getEntityPolicyFields(groupName, role, fvType);
    reply.status(200).send(policyFields);
    } catch (error) {
      reply.status(200).send({ success: false, message: "Something went wrong", error: error });
    }
  }
  async getCartList(
    request: FastifyRequest<{ Body: { fvType: string, groupName: string, cartId: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { fvType, groupName, cartId } = request.body;
      // /const cartList = await this.userService.getCartList(cartId);
      logger.info(`getCartList: ${JSON.stringify(request.body)}`, { fvType, groupName, cartId });
      const rem =  [{
        buid: "1234567890`",
        uid: "1234567890",
        dad: "2021-01-01",
        cab: "2021-01-01"
      }]
      const role=  "agent";
      const policyFields = getEntityPolicyFields(groupName, role, fvType);
      const filteredCartList = rem.filter(cart => policyFields.some(field => cart[field.key as keyof typeof cart]));
      reply.status(200).send(filteredCartList);
    } catch (error) {
      reply.status(200).send({ success: false, message: "Something went wrong", error: error });
    }
  }
}
