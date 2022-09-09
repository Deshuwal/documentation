import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActivityComponent } from "./rba/rba.component";
import { AuthGaurd } from "../../shared/services/auth.gaurd";
import { Role } from "src/app/shared/models/role";
import { AuditedListComponent } from "./audited-list/audited-list.component";

const routes: Routes = [
	{
		path: "rba",
		component: ActivityComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.MdaAdmin, Role.SuperAdmin],
		},
	},
	{
		path: "audited-list",
		component: AuditedListComponent,
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
export class AuditRoutingModule {}
