/**
 * Policy system types for role-based field inclusion/exclusion.
 * Policies define which fields are visible to which roles.
 */

export type Role = "admin" | "editor" | "viewer";

export type FieldPolicy<T extends Record<string, unknown>> = {
  /**
   * Fields to include for a role (takes precedence over exclude).
   * If undefined, all fields are included (subject to exclude rules).
   */
  include?: Partial<Record<Role, Array<keyof T>>>;
  /**
   * Fields to exclude for a role.
   * If undefined, no fields are excluded.
   */
  exclude?: Partial<Record<Role, Array<keyof T>>>;
};

/**
 * Policy definition for a specific entity type.
 */
export type EntityPolicy<T extends Record<string, unknown>> = {
  fields: FieldPolicy<T>;
};
