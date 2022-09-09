import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MdaComponent } from "./mdas/mda.component";
import { RulesBulkComponent } from "./rules-bulk/rules.component";
import { MdaBulkComponent } from "./mda-bulk/mda-bulk.component";
import { GenderComponent } from "./gender/gender.component";
import { MaritalStatusComponent } from "./marital-status/marital-status.component";
import { TaxItemComponent } from "./tax-items/tax-item.component";
import { TitlesComponent } from "./titles/titles.component";
import { OccupationComponent } from "./occupation/occupations.component";
import { EmploymentStatusComponent } from "./employment-status/employment-status.component";
import { CofigurationsComponent } from "./cofigurations/cofigurations.component";

import { Manage_usersComponent } from "./manage_users/manage_users.component";
import { Manage_companiesComponent } from "./manage_companies/manage_companies.component";
import { PrintCompanyPDF } from "./print-company/print-company-pdf.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { Role } from "src/app/shared/models/role";
import { AuditTargetComponent } from "./audit_target/audit_target.component";
import { FixedTaxItemsComponent } from "./fixed_tax_items/fixed_tax_items.component";
import { BusinessIndustryComponent } from "./business-industry/business-industry.component";
import { ManageBusinessIndustriesComponent } from "./manage_business_industries/manage_business_industries.component";

const routes: Routes = [
	{
		path: "mdas",
		component: MdaComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "tax-items",
		component: TaxItemComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},

	{
		path: "mda-bulk",
		component: MdaBulkComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "configurations",
		component: CofigurationsComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.Vendor],
		},
	},

	{
		path: "audit_target",
		component: AuditTargetComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "fixed_tax_items",
		component: FixedTaxItemsComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin, Role.MdaAdmin],
		},
	},
	{
		path: "rules-bulk",
		component: RulesBulkComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},

	{
		path: "titles",
		component: TitlesComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "occupations",
		component: OccupationComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "create-business-industry",
		component: BusinessIndustryComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "manage-business-industries",
		component: ManageBusinessIndustriesComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "gender",
		component: GenderComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "employment-status",
		component: EmploymentStatusComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "marital-status",
		component: MaritalStatusComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin],
		},
	},
	{
		path: "assign-role",
		component: Manage_usersComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
		},
	},
	{
		path: "companies",
		component: Manage_companiesComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.MdaAdmin, Role.SuperAdmin, Role.Reporting],
		},
	},
	{
		path: "companies/preview-company/:id",
		component: PrintCompanyPDF,
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
export class MdaRoutingModule {}
