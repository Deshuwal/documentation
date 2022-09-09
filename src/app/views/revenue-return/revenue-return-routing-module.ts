import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { Role } from "src/app/shared/models/role";
import { IndividualRevenueReturnsComponent } from "./individual-revenue-return/individual-revenue-return-tax.component";
import { CorporateRevenueReturnComponent } from "./corporate-revenue-return/corporate.component";
import { PreviousRevenueReturnsComponent } from "./previous-revenue-returns/previous-revenue-returns.component";
import { PreviousRevenueReturnCorporateComponent } from "./previous-revenue-return-corporate/previous-revenue-return-corporate.component";;

const routes: Routes = [
  {
    path: "individual",
    component: IndividualRevenueReturnsComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting, Role.User],
    },
  },
  {
    path: "corporate",
    component: CorporateRevenueReturnComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting, Role.User],
    },
  },
  {
    path: "previous-revenue-returns",
    component: PreviousRevenueReturnsComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting, Role.User],
    },
  },
  {
    path: "previous-revenue-return-corporate",
    component: PreviousRevenueReturnCorporateComponent,
    canActivate: [AuthGaurd],
    data: {
      roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting, Role.User],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevenueReturnRoutingModule {}
