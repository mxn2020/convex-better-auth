import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

type MyStatements = typeof ac.statements;

export type PermissionRequest = {
  [K in keyof MyStatements]?: MyStatements[K][number][];
};

// Define roles as constants
export const ROLES = {
  VISITOR: 'visitor' as const,
  APPLICANT: 'applicant' as const,
  MEMBER: 'member' as const,
  EDITOR: 'editor' as const,
  STAFF: 'staff' as const,
  ADMIN: 'admin' as const,
  SUPERADMIN: 'superadmin' as const,
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// Define ALL resources and their possible actions (features)
const statement = {
  ...defaultStatements,  // Keep admin/user defaults (user/session management)
  // App-specific features
  prompt: ["read", "create", "update", "delete", "execute"],
  repository: ["read", "create", "update", "delete", "fork"],
  task: ["read", "create", "update", "delete", "assign", "complete"],
  content: ["read", "create", "update", "delete", "publish"],
} as const;

export const ac = createAccessControl(statement);

// Role definitions - granular permissions per feature
export const visitorRole = ac.newRole({
  // Read-only limited access
  prompt: ["read"],
  repository: ["read"],
  task: ["read"],
  content: ["read"],
});

export const applicantRole = ac.newRole({
  ...visitorRole.statements,  // Inherit visitor
  user: ["get", "update"],  // Can manage own profile
  prompt: ["read", "create"],  // Can create own prompts
  task: ["read", "create"],
});

export const memberRole = ac.newRole( {
  ...applicantRole.statements,  // Inherit applicant
  prompt: ["read", "create", "update", "delete"],  // Full own resources
  repository: ["read", "create"],
  task: ["read", "create", "update"],
  content: ["read", "create"],
});

export const editorRole = ac.newRole({
  ...memberRole.statements,  // Inherit member
  user: [...memberRole.statements.user, "list"],
  prompt: ["read", "create", "update", "delete", "execute"],
  repository: ["read", "create", "update"],
  task: ["read", "create", "update", "assign"],
  content: ["read", "create", "update", "publish"],
});

export const staffRole = ac.newRole({
  ...editorRole.statements,  // Inherit editor
  user: [...(editorRole.statements.user || []), "ban"], // Staff can also ban?
  repository: ["read", "create", "update", "delete"],
  task: ["read", "create", "update", "delete", "assign"],
});

export const adminRole = ac.newRole({
  ...staffRole.statements, // Inherit EVERYTHING from Staff first
  ...adminAc.statements,   // Then add the Better-Auth admin powers
  content: ["read", "create", "update", "delete", "publish"],
  repository: [...staffRole.statements.repository, "fork"],
});

export const superadminRole = ac.newRole({
  user: [...defaultStatements.user], 
  session: [...defaultStatements.session],
  prompt: ["read", "create", "update", "delete", "execute"],
  repository: ["read", "create", "update", "delete", "fork"],
  task: ["read", "create", "update", "delete", "assign", "complete"],
  content: ["read", "create", "update", "delete", "publish"],
});


// Export all roles for easy import in auth config
export const roles = {
  [ROLES.VISITOR]: visitorRole,
  [ROLES.APPLICANT]: applicantRole,
  [ROLES.MEMBER]: memberRole,
  [ROLES.EDITOR]: editorRole,
  [ROLES.STAFF]: staffRole,
  [ROLES.ADMIN]: adminRole,
  [ROLES.SUPERADMIN]: superadminRole,
} as const;
