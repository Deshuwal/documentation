//this is the link between the parent module and the child
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TaxpayerRoutingModule } from "./taxpayer-routing-module";
import { DashboadDefaultComponent } from "./dashboad-default/dashboad-default.component";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";
import { RegisterVendorComponent } from "./register-account/register_account.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RegisterComponent } from "./register-user/register-user.component";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { UpdateComponent } from "./update-user/update-user.component";
import { PrintUserPDF } from "./print-pdf/print-pdf.component";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { RegisterUserBulkComponent } from "./register-user-bulk/register-user-bulk.component";
import { RegisterCompanyBulkComponent } from "./register-company-bulk/register-company-bulk.component";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { MigrateUserComponent } from "./migrate-user/migrate-user.component";
import { MigrateCompanyComponent } from "./migrate-company/migrate-company.component";
import { ChangeUserPassword } from "./change-user-password/change-user-password.component";
@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgbModule,
		TaxpayerRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgSelectModule,
		NgxDatatableModule,
		SharedPipesModule,
		SelectDropDownModule,
	],

	declarations: [
		DashboadDefaultComponent,
		CompleteProfileComponent,
		RegisterVendorComponent,
		UpdateComponent,
		RegisterComponent,
		PrintUserPDF,
		RegisterUserBulkComponent,
		RegisterCompanyBulkComponent,
		RegisterCompanyComponent,
		MigrateUserComponent,
		MigrateCompanyComponent,
		ChangeUserPassword
	],
	exports: [FormsModule],
})
export class TaxpayerModule {}
