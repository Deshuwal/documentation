import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdaRoutingModule } from "./mda-admin-routing-module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

import { PayeComponent } from "./paye-bulk/paye.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { Manage_usersComponent } from "./manage_users/manage_users.component";
import { Manage_companiesComponent } from "./manage_companies/manage_companies.component";
import { MdaComponent } from "./mdas/mda.component";
import { RulesBulkComponent } from "./rules-bulk/rules.component";
import { MdaBulkComponent } from "./mda-bulk/mda-bulk.component";
import { GenderComponent } from "./gender/gender.component";
import { MaritalStatusComponent } from "./marital-status/marital-status.component";
import { TaxItemComponent } from "./tax-items/tax-item.component";
import { TitlesComponent } from "./titles/titles.component";
import { EmploymentStatusComponent } from "./employment-status/employment-status.component";
import { NgxPaginationModule } from "ngx-pagination";
import { CofigurationsComponent } from "./cofigurations/cofigurations.component"; // <-- import the module
import { PrintCompanyPDF } from "./print-company/print-company-pdf.component";
import { CsvModule } from "@ctrl/ngx-csv";
import { AuditTargetComponent } from "./audit_target/audit_target.component";
import { FixedTaxItemsComponent } from "./fixed_tax_items/fixed_tax_items.component";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { OccupationComponent } from "./occupation/occupations.component";
import { BusinessIndustryComponent } from "./business-industry/business-industry.component";
import { ManageBusinessIndustriesComponent } from "./manage_business_industries/manage_business_industries.component";

@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgxDatatableModule,
		NgbModule,
		MdaRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgSelectModule,
		NgxPaginationModule,
		CsvModule,
		SelectDropDownModule,
	],

	declarations: [
		FixedTaxItemsComponent,
		MdaComponent,
		PayeComponent,
		MdaBulkComponent,
		RulesBulkComponent,
		GenderComponent,
		AuditTargetComponent,
		MaritalStatusComponent,
		TaxItemComponent,
		TitlesComponent,
		EmploymentStatusComponent,
		Manage_usersComponent,
		CofigurationsComponent,
		Manage_companiesComponent,
		PrintCompanyPDF,
		OccupationComponent,
		BusinessIndustryComponent,
		ManageBusinessIndustriesComponent
	],
	exports: [FormsModule],
})
export class MdaAdminModule {}
