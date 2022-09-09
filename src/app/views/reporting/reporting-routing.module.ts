
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Role } from "src/app/shared/models/role";
import { PaymentHistoryComponent } from "./payment_history/payment-history.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { Manage_companiesComponent } from "./manage_companies/manage_companies.component";
import { Manage_usersComponent } from "./manage_users/manage_users.component"; 
import { ActivityComponent } from "./activity/activity.component"; 
import { ReportComponent } from "./report/report.component";
import { MDASBreakdown } from "./mdas_breakdown/mdas-breakdown";
import { PsirsBreakdown } from "./psirs_breakdown/psirs-breakdown";
import { OtherMDARevenueBreakdown } from './other_mda_breakdown/other-mda-breakdown';
const routes: Routes = [
  {
    path: "users",
    component: Manage_usersComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin],
    },
  },
  {
    path: "psirs-breakdown",
    component: PsirsBreakdown,
  },
  {
    path: "other-mda-breakdown",
    component: OtherMDARevenueBreakdown,
  },
  {
    path: "mdas-breakdown",
    component: MDASBreakdown,
  },
  {
    path: "reporting",
    component: ReportComponent,
  },
  {
    path: "companies",
    component: Manage_companiesComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin],
    },
  },
  {
    path: "audit-trail",
    component: ActivityComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.SuperAdmin],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
