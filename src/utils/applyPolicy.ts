import { logger } from "../core/logger/logger";
import { Role } from "../policies/policy.types";

/**
 * Applies role-based inclusion/exclusion policy to an object.
 * 
 * Rules:
 * - Inclusion takes precedence over exclusion
 * - If a role has include fields, only those fields are returned
 * - If a role has exclude fields (and no include), those fields are removed
 * - If a role has neither, all fields are returned
 * 
 * @param data - The object to apply policy to
 * @param policy - The field policy definition
 * @param roles - Array of user roles (uses first matching role)
 * @returns A new object with policy applied (immutable)
 */
export function applyPolicy<T extends Record<string, unknown>>(
  data: T,
  policyFields: any,
  role: string,
): Partial<T> {

  // Apply exclusion if defined
  const result = policyFields.filter((field: any) => data[field]).map((field: any) => {
    return {[field]: data[field]};
  });
  return result;
}
