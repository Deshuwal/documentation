
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportingRoutingModule } from "./reporting-routing.module"; 
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination"; 
import { CsvModule } from "@ctrl/ngx-csv"; 
import { ActivityComponent } from "./activity/activity.component";
import { QRCodeModule } from "angularx-qrcode";


import { PaymentHistoryComponent } from "./payment_history/payment-history.component"; 
import { Manage_companiesComponent } from "./manage_companies/manage_companies.component";
import { Manage_usersComponent } from "./manage_users/manage_users.component"; 
import { SelectDropDownModule } from "ngx-select-dropdown";
import { ReportComponent } from "./report/report.component";
import { MDASBreakdown } from "./mdas_breakdown/mdas-breakdown";
import { PsirsBreakdown } from "./psirs_breakdown/psirs-breakdown";
import { OtherMDARevenueBreakdown } from "./other_mda_breakdown/other-mda-breakdown";

@NgModule({
  declarations: [
    Manage_usersComponent, 
    ActivityComponent, 
    PaymentHistoryComponent, 
    Manage_companiesComponent, 
    ReportComponent,
    MDASBreakdown,
    PsirsBreakdown,
    OtherMDARevenueBreakdown
  ],
  
  imports: [
    CommonModule,
    ReportingRoutingModule,
    SharedComponentsModule,
    SelectDropDownModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    CommonModule,
    SharedComponentsModule,
    NgxDatatableModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    CsvModule,

    CommonModule,
    SharedComponentsModule,
    NgxDatatableModule,
    NgbModule, 
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    SelectDropDownModule,
    CsvModule, 
    QRCodeModule,
  ],
  exports: [FormsModule],
})
export class ReportingModule {}
