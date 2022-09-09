import { Role } from "./role";

export const UserPortal: Record<Role, string> = {
  [Role.User]: "taxPayer",
  [Role.SuperAdmin]: "admin",
  [Role.Vendor]: "vendor",
  [Role.MdaAdmin]: "mdaAdmin",
  [Role.DemandNotice]: "demand-notice",
  [Role.Reporting]: "reporting",
  [Role.accountsOfficer]: "accountsOfficer",
};
 