import { FastifyInstance } from "fastify";
import { FieldsController } from "./fields.controller";

/**
 * Register field policy routes for inclusion/exclusion management
 */
export const registerFieldsRoutes = (app: FastifyInstance): void => {
  const controller = new FieldsController();

  // GET endpoints
  
  // Get fields filtered by role (inclusion-based)
  // Query params: groupName, fvType, role (optional)
  app.get("/fields", async (request, reply) => controller.getFields(request as any, reply));

  // Get all fields for an entity (unfiltered by role)
  // Query params: groupName, fvType (optional)
  app.get("/fields/all", async (request, reply) => controller.getAllFields(request as any, reply));

  // Get available group names
  app.get("/fields/groups", async (request, reply) => controller.getGroups(request, reply));

  // Get available fvTypes
  app.get("/fields/types", async (request, reply) => controller.getTypes(request, reply));

  // POST endpoints

  // Update inclusion and/or exclusion roles for a single field
  // Body: { groupName, fvType, fieldKey, includeRoles?: ["admin", "agent"], excludeRoles?: ["viewer"] }

  // Bulk update inclusion/exclusion for multiple fields
  // Body: { groupName, fvType, fields: [{ fieldKey, includeRoles, excludeRoles }] }
  app.post("/fields/bulkUpdateFieldRoles", async (request, reply) => controller.bulkUpdateFieldRoles(request as any, reply));
};
