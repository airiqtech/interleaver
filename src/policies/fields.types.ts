/**
 * Types for field policy management with inclusion/exclusion rules.
 */

export type Role = "admin" | "agent" | "viewer";

export interface PolicyField {
  key: string;
  label: string;
  groupName: string;
  fvType: "filter" | "table";
  /** Allowed roles - roles that can see this field (inclusion list) */
  ar: Role[];
  /** Excluded roles - roles that cannot see this field (exclusion list) */
  er?: Role[];
}

export interface FieldResponse {
  key: string;
  label: string;
}

export interface GetFieldsRequest {
  groupName: string;
  fvType: string;
  role?: string;
}

export interface UpdateFieldInclusionRequest {
  groupName: string;
  fvType: string;
  fieldKey: string;
  ar?: Role[];
}

export interface BulkUpdateFieldsRequest {
  groupName: string;
  fvType: string;
  /** Array of field keys and their role configurations */
  fields: {
    fieldKey: string;
    ar?: Role[];
  }[];
}

export interface FieldPolicyResponse {
  success: boolean;
  message?: string;
  data?: FieldResponse[] | PolicyField[];
}
