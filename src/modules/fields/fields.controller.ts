import { FastifyReply, FastifyRequest } from "fastify";
import { 
  getEntityPolicyFields, 
  getAllEntityFields, 
  updateFieldRoles, 
  bulkUpdateFieldRoles,
  getAvailableGroups,
  getAvailableFvTypes,
} from "../../policies/fields.policy";
import { 
  GetFieldsRequest, 
  UpdateFieldInclusionRequest, 
  BulkUpdateFieldsRequest 
} from "../../policies/fields.types";

/**
 * Controller for field policy management (inclusion/exclusion)
 */
export class FieldsController {
  
  /**
   * GET /fields - Get fields filtered by role (inclusion-based)
   */
  async getFields(
    request: FastifyRequest<{ Querystring: GetFieldsRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { groupName, fvType, role } = request.query;

      if (!groupName || !fvType) {
        return reply.status(200).send({ 
          success: false, 
          message: "Missing required query parameters: groupName and fvType" 
        });
      }

      // Default role to 'agent' if not provided
      const userRole = role || "agent";
      const fields = getEntityPolicyFields(groupName, userRole, fvType);

      reply.status(200).send({ 
        success: true, 
        data: fields,
        meta: {
          groupName,
          fvType,
          role: userRole,
          count: fields.length,
        }
      });
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to get fields", 
        error: String(error) 
      });
    }
  }

  /**
   * GET /fields/all - Get all fields for an entity (unfiltered)
   */
  async getAllFields(
    request: FastifyRequest<{ Querystring: { groupName: string; fvType?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { groupName, fvType } = request.query;

      if (!groupName) {
        return reply.status(200).send({ 
          success: false, 
          message: "Missing required query parameter: groupName" 
        });
      }
      const role = "agent";
      const fields = getAllEntityFields(groupName, fvType, role);

      reply.status(200).send({ 
        success: true, 
        data: fields,
        meta: {
          groupName,
          fvType: fvType || "all",
          count: fields.length,
        }
      });
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to get all fields", 
        error: String(error) 
      });
    }
  }

  /**
   * GET /fields/groups - Get available group names
   */
  async getGroups(
    _request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const groups = getAvailableGroups();
      reply.status(200).send({ 
        success: true, 
        data: groups 
      });
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to get groups", 
        error: String(error) 
      });
    }
  }

  /**
   * GET /fields/types - Get available fvTypes
   */
  async getTypes(
    _request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const types = getAvailableFvTypes();
      reply.status(200).send({ 
        success: true, 
        data: types 
      });
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to get types", 
        error: String(error) 
      });
    }
  }

  /**
   * POST /fields/inclusion - Update inclusion roles for a field
   */
  async updateInclusion(
    request: FastifyRequest<{ Body: UpdateFieldInclusionRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!request.body) {
        return reply.status(200).send({ 
          success: false, 
          message: "Request body is required" 
        });
      }

      const { groupName, fvType, fieldKey, ar } = request.body;

      if (!groupName || !fvType || !fieldKey) {
        return reply.status(200).send({ 
          success: false, 
          message: "Missing required fields: groupName, fvType, fieldKey" 
        });
      }

      const result = updateFieldRoles({
        groupName,
        fvType,
        fieldKey,
        ar,
      });

      reply.status(200).send(result);
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to update inclusion", 
        error: String(error) 
      });
    }
  }

  /**
   * POST /fields/exclusion - Update exclusion roles for a field
   */
  async updateExclusion(
    request: FastifyRequest<{ Body: UpdateFieldInclusionRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!request.body) {
        return reply.status(200).send({ 
          success: false, 
          message: "Request body is required" 
        });
      }

      const { groupName, fvType, fieldKey, ar } = request.body;

      if (!groupName || !fvType || !fieldKey) {
        return reply.status(200).send({ 
          success: false, 
          message: "Missing required fields: groupName, fvType, fieldKey" 
        });
      }

      const result = updateFieldRoles({
        groupName,
        fvType,
        fieldKey,
        ar
      });

      reply.status(200).send(result);
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to update exclusion", 
        error: String(error) 
      });
    }
  }

  /**
   * POST /fields/bulk - Bulk update inclusion/exclusion for multiple fields
   */
  async bulkUpdateFieldRoles(
    request: FastifyRequest<{ Body: BulkUpdateFieldsRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!request.body) {
        return reply.status(200).send({ 
          success: false, 
          message: "Request body is required" 
        });
      }

      const { groupName, fvType, fields } = request.body;

      if (!groupName || !fvType || !fields || !Array.isArray(fields)) {
        return reply.status(200).send({ 
          success: false, 
          message: "Missing required fields: groupName, fvType, fields (array)" 
        });
      }

      const result = bulkUpdateFieldRoles(request.body);
      reply.status(200).send(result);
    } catch (error) {
      reply.status(200).send({ 
        success: false, 
        message: "Failed to bulk update fields", 
        error: String(error) 
      });
    }
  }
}
