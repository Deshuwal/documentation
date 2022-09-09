import { Role } from "./role";

export const RoleHome: Record<Role | string, string> = {
  default: "/taxpayer/home",
  [Role.User]: "/taxpayer/home",
  [Role.SuperAdmin]: "/taxpayer/home",
  [Role.Vendor]: "/taxpayer/home",
  [Role.MdaAdmin]: "/taxpayer/home",
  [Role.DemandNotice]: "/taxpayer/home",
  [Role.Reporting]: "/taxpayer/home",
  [Role.accountsOfficer]: "/taxpayer/home",
};
