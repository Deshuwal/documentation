import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboadDefaultComponent } from "./dashboad-default/dashboad-default.component";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";
import { RegisterVendorComponent } from "./register-account/register_account.component";
import { RegisterComponent } from "./register-user/register-user.component";
import { UpdateComponent } from "./update-user/update-user.component";
import { ManageUserResolver } from "../mda-admin/manage_users/manage_users-resolver.service";
import { PrintUserPDF } from "./print-pdf/print-pdf.component";
import { RegisterUserBulkComponent } from "./register-user-bulk/register-user-bulk.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { Role } from "src/app/shared/models/role";
import { RegisterCompanyBulkComponent } from "./register-company-bulk/register-company-bulk.component";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { MigrateUserComponent } from "./migrate-user/migrate-user.component";
import { MigrateCompanyComponent } from "./migrate-company/migrate-company.component";
import { ChangeUserPassword } from "./change-user-password/change-user-password.component";

const routes: Routes = [
  {
    path: "home",
    component: DashboadDefaultComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: "register-vendor",
    component: RegisterVendorComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: "complete-profile",
    component: CompleteProfileComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: "register-user",
    component: RegisterComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin],
    },
  },
  {
    path: "migrate-user",
    component: MigrateUserComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin],
    },
  },
  {
    path: "change-user-password",
    component: ChangeUserPassword,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin],
    },
  },
  {
    path: "register-Company-bulk",
    component: RegisterCompanyBulkComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
    },
  },
  {
    path: "register-company",
    component: RegisterCompanyComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
    },
  },
  {
    path: "migrate-company",
    component: MigrateCompanyComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
    },
  },
  {
    path: "register-user-bulk",
    component: RegisterUserBulkComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
    },
  },
  {
    path: "update-user/:id",
    component: UpdateComponent,
    resolve: { users: ManageUserResolver },
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin],
    },
  },
  {
    path: "preview-user/:id",
    component: PrintUserPDF,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxpayerRoutingModule {}
