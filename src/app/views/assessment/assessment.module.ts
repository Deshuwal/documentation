import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AssessmentRoutingModule } from "./assessment-routing-module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

import { PayeComponent } from "./paye-bulk/paye.component";
import { RoadTaxComponent } from "./road-taxes/road-tax.component";
import { PresumtiveTaxComponent } from "./presumtive-taxes/presumtive-tax.component";
import { AssessmentComponent } from "./assessment/assessment.component";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { ConsumptionTaxComponent } from "./consumption-tax/consumption-tax.component";
import { DemandNoticeComponent } from "./demand_notice/demand-notice.component";
import { CsvModule } from "@ctrl/ngx-csv";
import { BulkDemandNoticeComponent } from "./bulk-demand-notice/bulk-demand-notice.component";
import { PreviousAssessmentComponent } from "./previous-assessments/previous-assessment.component";
import { PreviousBulkAssessmentComponent } from "./paye-bulk/previous-bulk-assessments/previous-bulk-assessment.component";
import { ViewIndividualBulkAssessmentComponent } from "./paye-bulk/view-individual-bulk-assessment/view-individual-bulk-assessment.component";
import { PresumptiveTaxComponent } from "./presumptive-tax/personal-income-tax.component";
import { EntertainmentTaxComponent } from "./entertainment-tax/entertainment-tax.component";
import { ToNumberPipe } from "src/app/shared/pipes/toNumber";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { PresumptiveComponent } from "./presumptive-tax-bulk/presumptive.component";
import { PreviousPresumptiveTaxAssessmentComponent } from "./presumptive-tax-bulk/previous-bulk-assessments/previous-bulk-assessment.component";
import { ViewIndividualPresumptiveTaxAssessmentComponent } from "./presumptive-tax-bulk/view-individual-bulk-assessment/view-individual-bulk-assessment.component";
import { PersonalIncomeTaxComponent } from "./personal-income-tax/personal-income-tax.component";
import { MotorLicenseAuthority } from "./motor-license-authority/mla.component";
import { ViewRegisteredVehicleComponent } from "./mla-view/previous-mla.component";

import { Paye_calculatorComponent } from "./paye_calculator/paye_calculator.component";
import { LgcRevenueComponent } from "./LGC-Revenue/lgc_revenue.component";
import { ModifyAssessmentComponent } from "./modify-assessment/modify-assessment.component";
import { PreviousLGCRevenueComponent } from "./previous-LGC-Revenue/previous-LGC-Revenue.component";

@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgbModule,
		AssessmentRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgSelectModule,
		NgxDatatableModule,
		SelectDropDownModule,
		CsvModule,
		SharedPipesModule,
	],

	declarations: [
		Paye_calculatorComponent,
		AssessmentComponent,
		PreviousAssessmentComponent,
		PresumtiveTaxComponent,
		RoadTaxComponent,
		PayeComponent,
		ConsumptionTaxComponent,
		DemandNoticeComponent,
		ModifyAssessmentComponent,
		BulkDemandNoticeComponent,
		PreviousBulkAssessmentComponent,
		ViewIndividualBulkAssessmentComponent,
		PresumptiveTaxComponent,
		EntertainmentTaxComponent,
		PresumptiveComponent,
		PreviousPresumptiveTaxAssessmentComponent,
		ViewIndividualPresumptiveTaxAssessmentComponent,
		PersonalIncomeTaxComponent,
		MotorLicenseAuthority,
		ViewRegisteredVehicleComponent,
		LgcRevenueComponent,
		PreviousLGCRevenueComponent,
	],
	exports: [FormsModule, ToNumberPipe],
})
export class AssessmentModule {}
