import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GenerateTccComponent } from "./generate-tcc/generate-tcc.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { PreviousTccComponent } from "./previous-tcc/previous-tcc.component";
import { PrintTccComponent } from "./print-tcc/print-tcc.component";

const routes: Routes = [
  {
    path: "generate",
    component: GenerateTccComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: "previous-tcc",
    component: PreviousTccComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: ":id",
    component: PrintTccComponent,
    canActivate: [AuthGaurd],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxpayerRoutingModule {}
