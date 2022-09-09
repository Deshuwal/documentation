import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { IndividualRevenueReturnsComponent } from "./individual-revenue-return/individual-revenue-return-tax.component";
import { RevenueReturnRoutingModule } from "./revenue-return-routing-module";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { CorporateRevenueReturnComponent } from "./corporate-revenue-return/corporate.component";
import { PreviousRevenueReturnAssessmentComponent } from "./corporate-revenue-return/previous-bulk-assessments/previous-revenue-return-assessment.component";
import { ViewIndividualRevenuReturnAssessmentComponent } from "./corporate-revenue-return/view-individual-revenue-return-assessment/view-individual-revenue-return-assessment.component";
import { CsvModule } from "@ctrl/ngx-csv";
import { PreviousRevenueReturnsComponent } from "./previous-revenue-returns/previous-revenue-returns.component";
import { PreviousRevenueReturnCorporateComponent } from './previous-revenue-return-corporate/previous-revenue-return-corporate.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxDatatableModule,
    NgbModule,
    RevenueReturnRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    SelectDropDownModule,
    CsvModule,
  ],

  declarations: [
    IndividualRevenueReturnsComponent,
    CorporateRevenueReturnComponent,
    PreviousRevenueReturnAssessmentComponent,
    ViewIndividualRevenuReturnAssessmentComponent,
    PreviousRevenueReturnsComponent,
    PreviousRevenueReturnCorporateComponent
  ],
  exports: [FormsModule],
})
export class RevenueReturnModule {}
