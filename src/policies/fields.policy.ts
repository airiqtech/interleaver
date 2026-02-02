import { PolicyField, Role, FieldResponse, UpdateFieldInclusionRequest, BulkUpdateFieldsRequest } from "./fields.types";

// data should come from data or cache in future
// In production, this would be stored in a database

const userPolicyFields: PolicyField[] = [
  {
    key:"userIds",
    label:"User IDs",
    groupName:"user",
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"createdOnAfterDate",
    label:"Created On After Date",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"createdOnBeforeDate",
    label:"Created On Before Date",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","viewer"]
  },
  {
    key:"roles",
    label:"Roles",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"statuses",
    label:"Statuses",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"email",
    label:"Email",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"mobile",
    label:"Mobile",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"salesUserIdIn",
    label:"Sales User ID In",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"groups",
    label:"Groups",
    groupName:"user", 
    fvType:"filter",
    ar:["admin","viewer"]
  },
  {
    key:"distributorId",
    label:"Distributor ID",
    groupName:"user", 
    fvType:"table",
    ar:["admin","agent","viewer"]
  }
]

const orderPolicyFields: PolicyField[] = [
  {
    key:"bookingId",
    label:"Booking ID",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"bookingUserId",
      label:"Booking User ID",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"createdOnAfterDateTime",
    label:"Created On After Date Time",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","viewer"]
  },
  {
    key:"createdOnBeforeDateTime",
    label:"Created On Before Date Time",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"paymentStatus",
    label:"Payment Status",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
        key:"airlines",
    label:"Airlines",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"tripTypes",
    label:"Trip Types",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"roles",
    label:"Roles",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"passengerFirstName",
    label:"Passenger First Name",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","viewer"]
  },
  {
    key:"passengerLastName",
    label:"Passenger Last Name",
    groupName:"order", 
    fvType:"table",
    ar:["admin","agent","viewer"]
  },
  {
    key:"departedOnAfterDate",
    label:"Departed On After Date",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"departedOnBeforeDate",
    label:"Departed On Before Date",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"channels",
    label:"Channels",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"pnr",
        label:"PNR",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"gdsPnr",
    label:"GDS PNR",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"ticketNumber",
    label:"Ticket Number",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"supplierIds",
    label:"Supplier IDs",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"groupIds",
    label:"Group IDs",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"sourceIds",
    label:"Source IDs",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"loggedInUserId",
    label:"Logged In User ID",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  },
  {
    key:"assignedUserIdIn",
    label:"Assigned User ID In",
    groupName:"order", 
    fvType:"filter",
    ar:["admin","agent","viewer"]
  }
]


// Mutable store for policy fields (in production, use database)
let allPolicyFields: PolicyField[] = [
  ...userPolicyFields,
  ...orderPolicyFields,
];

/**
 * Get fields for an entity filtered by role and fvType (inclusion-based)
 */
export const getEntityPolicyFields = (entity: string, role: string, fvType: string): FieldResponse[] => {
  const result = allPolicyFields
    .filter(field => 
      field.groupName === entity && 
      field.ar.includes(role as Role) && 
      field.fvType === fvType &&
      // Also check exclusion list if present
      !(field.er && field.er.includes(role as Role))
    )
    .map(field => ({
      key: field.key,
      label: field.label,
    }));
  return result;
};

/**
 * Get all fields for an entity (unfiltered by role)
 */
export const getAllEntityFields = (entity: string, fvType?: string, role?: string): PolicyField[] => {
  return allPolicyFields.filter(field => 
    field.groupName === entity && 
    (fvType ? field.fvType === fvType : true) &&
    (role ? field.ar.includes(role as Role) : true)
  ).map(field => ({
    key: field.key,
    label: field.label,
  })) as PolicyField[];
};

/**
 * Get a single field by key and groupName
 */
export const getFieldByKey = (groupName: string, fieldKey: string): PolicyField | undefined => {
  return allPolicyFields.find(field => 
    field.groupName === groupName && field.key === fieldKey
  );
};

/**
 * Update inclusion/exclusion roles for a field
 */
export const updateFieldRoles = (request: UpdateFieldInclusionRequest): { success: boolean; message: string; field?: PolicyField   } => {
  const fieldIndex = allPolicyFields.findIndex(field => 
    field.groupName === request.groupName && 
    field.key === request.fieldKey &&
    field.fvType === request.fvType
  );

  if (fieldIndex === -1) {
    return { success: false, message: `Field '${request.fieldKey}' not found in group '${request.groupName}'` };
  }

  const field = allPolicyFields[fieldIndex];

  // Add roles to inclusion list
  if (request.ar && request.ar.length > 0) {
    const newRoles = request.ar.filter(role => !field.ar.includes(role));
    field.ar = [...field.ar, ...newRoles];
    
    // Remove from exclusion list if present
    if (field.er) {
      field.er = field.er.filter(role => !request.ar!.includes(role));
    }
  }
  allPolicyFields[fieldIndex] = field;
  
  return { success: true, message: "Field roles updated successfully", field };
};

/**
 * Bulk update inclusion/exclusion roles for multiple fields
 */
export const bulkUpdateFieldRoles = (request: BulkUpdateFieldsRequest): { success: boolean; message: string; results: { fieldKey: string; success: boolean; message: string }[] } => {
  const results = request.fields.map(fieldUpdate => {
    const result = updateFieldRoles({
      groupName: request.groupName,
      fvType: request.fvType,
      fieldKey: fieldUpdate.fieldKey,
      ar: fieldUpdate.ar,
    });
    return {
      fieldKey: fieldUpdate.fieldKey,
      success: result.success,
      message: result.message,
    };
  });

  const allSucceeded = results.every(r => r.success);
  
  return {
    success: allSucceeded,
    message: allSucceeded ? "All fields updated successfully" : "Some fields failed to update",
    results,
  };
};

/**
 * Get all available group names
 */
export const getAvailableGroups = (): string[] => {
  const groups = new Set(allPolicyFields.map(field => field.groupName));
  return Array.from(groups);
};

/**
 * Get all available fvTypes
 */
export const getAvailableFvTypes = (): string[] => {
  const types = new Set(allPolicyFields.map(field => field.fvType));
  return Array.from(types);
};
