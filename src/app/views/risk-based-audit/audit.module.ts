import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { ActivityComponent } from "./rba/rba.component";
import { AuditRoutingModule } from "./audit.routing.module";
import { CsvModule } from "@ctrl/ngx-csv";
import { AuditedListComponent } from "./audited-list/audited-list.component";

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    SharedComponentsModule,
    AuditRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxDatatableModule,
    CsvModule,
  ],
  declarations: [ActivityComponent, AuditedListComponent],
  exports: [FormsModule],
})
export class AuditModule {}
