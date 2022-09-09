import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreviousAssessmentComponent } from "./previous-assessments/previous-assessment.component";
import { PayeComponent } from "./paye-bulk/paye.component";
import { RoadTaxComponent } from "./road-taxes/road-tax.component";
import { AssessmentComponent } from "./assessment/assessment.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { ConsumptionTaxComponent } from "./consumption-tax/consumption-tax.component";
import { DemandNoticeComponent } from "./demand_notice/demand-notice.component";
import { BulkDemandNoticeComponent } from "./bulk-demand-notice/bulk-demand-notice.component";
import { Role } from "src/app/shared/models/role";
import { PreviousBulkAssessmentComponent } from "./paye-bulk/previous-bulk-assessments/previous-bulk-assessment.component";
import { ViewIndividualBulkAssessmentComponent } from "./paye-bulk/view-individual-bulk-assessment/view-individual-bulk-assessment.component";
import { PresumptiveTaxComponent } from "./presumptive-tax/personal-income-tax.component";
import { EntertainmentTaxComponent } from "./entertainment-tax/entertainment-tax.component";
import { PresumptiveComponent } from "./presumptive-tax-bulk/presumptive.component";
import { PreviousPresumptiveTaxAssessmentComponent } from "./presumptive-tax-bulk/previous-bulk-assessments/previous-bulk-assessment.component";
import { ViewIndividualPresumptiveTaxAssessmentComponent } from "./presumptive-tax-bulk/view-individual-bulk-assessment/view-individual-bulk-assessment.component";
import { MotorLicenseAuthority } from "./motor-license-authority/mla.component";
import { ViewRegisteredVehicleComponent } from "./mla-view/previous-mla.component";
import { Paye_calculatorComponent } from "./paye_calculator/paye_calculator.component";
import { LgcRevenueComponent } from "./LGC-Revenue/lgc_revenue.component";
import { PreviousLGCRevenueComponent } from "./previous-LGC-Revenue/previous-LGC-Revenue.component";
import { ModifyAssessmentComponent } from "./modify-assessment/modify-assessment.component";
import { PreviousRevenueReturnsComponent } from "../revenue-return/previous-revenue-returns/previous-revenue-returns.component";

const routes: Routes = [
	{
		path: "perform",
		component: AssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "history/:status",
		component: PreviousAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "history",
		component: PreviousAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "paye_calculator",
		component: Paye_calculatorComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-paye",
		component: PayeComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "previous-bulk-paye",
		component: PreviousBulkAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "view-bulk-paye-assessments/:bulk_paye_id/:tin/:billing_ref",
		component: ViewIndividualBulkAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-presumptive-tax",
		component: PresumptiveComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "modify-assessment",
		component: ModifyAssessmentComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "previous-bulk-presumptive-tax",
		component: PreviousPresumptiveTaxAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "view-bulk-presumptive-tax-assessments/:bulk_paye_id/:tin/:billing_ref",
		component: ViewIndividualPresumptiveTaxAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	// {
	//   path: "presumptive-tax",
	//   component: PresumtiveTaxComponent,
	//   canActivate: [AuthGaurd],
	// },
	{
		path: "road-tax",
		component: RoadTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "motor-license-authority",
		component: MotorLicenseAuthority,
		canActivate: [AuthGaurd],
	},
	{
		path: "view-motor-license-authority",
		component: ViewRegisteredVehicleComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "consumption-tax",
		component: ConsumptionTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "presumptive-tax",
		component: PresumptiveTaxComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "entertainment-tax",
		component: EntertainmentTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "page/:page",
		component: AssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "previous-assessments",
		component: PreviousAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "previous-lgc-revenue",
		component: PreviousLGCRevenueComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "demand-notices",
		component: DemandNoticeComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin, Role.DemandNotice],
		},
	},
	{
		path: "demand-notices/bulk",
		component: BulkDemandNoticeComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin, Role.DemandNotice],
		},
	},
	{
		path: "previous-bulk-presumptive-tax",
		component: PreviousPresumptiveTaxAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "view-bulk-presumptive-tax-assessments/:bulk_paye_id/:tin/:billing_ref",
		component: ViewIndividualPresumptiveTaxAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	// {
	//   path: "presumptive-tax",
	//   component: PresumtiveTaxComponent,
	//   canActivate: [AuthGaurd],
	// },
	{
		path: "road-tax",
		component: RoadTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "lgc-revenue",
		component: LgcRevenueComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "motor-license-authority",
		component: MotorLicenseAuthority,
		canActivate: [AuthGaurd],
	},
	{
		path: "view-motor-license-authority",
		component: ViewRegisteredVehicleComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "consumption-tax",
		component: ConsumptionTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "presumptive-tax",
		component: PresumptiveTaxComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "entertainment-tax",
		component: EntertainmentTaxComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "page/:page",
		component: AssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "previous-assessments",
		component: PreviousAssessmentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "demand-notices",
		component: DemandNoticeComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin, Role.DemandNotice],
		},
	},
	{
		path: "demand-notices/bulk",
		component: BulkDemandNoticeComponent,
		canActivate: [AuthGaurd],
		data: {
			roles: [Role.SuperAdmin, Role.DemandNotice],
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AssessmentRoutingModule {}
