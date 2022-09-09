import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaxpayerRoutingModule } from "./tcc-routing-module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { GenerateTccComponent } from "./generate-tcc/generate-tcc.component";
import { PreviousTccComponent } from "./previous-tcc/previous-tcc.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PrintTccComponent } from "./print-tcc/print-tcc.component";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";

@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgbModule,
		TaxpayerRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgxDatatableModule,
		SharedPipesModule,
	],

	declarations: [GenerateTccComponent, PreviousTccComponent, PrintTccComponent],
	exports: [FormsModule],
})
export class TaxpayerModule {}
