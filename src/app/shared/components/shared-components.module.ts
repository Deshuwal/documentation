import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaxEnumerationCardComponent } from "./tax-enumeration-card/tax-enumeration-card.component";
import { CreateDataCategoryCardComponent } from "./create-data-category-card/create-data-category-card.component";
import { BtnLoadingComponent } from "./btn-loading/btn-loading.component";
import { SearchIconComponent } from "./search-icon/search-icon.component";
import { RecaptchaComponent } from "./recaptcha/recaptcha.component";
import { FeatherIconComponent } from "./feather-icon/feather-icon.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharedPipesModule } from "../pipes/shared-pipes.module";
import { SearchModule } from "./search/search.module";
import { SharedDirectivesModule } from "../directives/shared-directives.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { LayoutsModule } from "./layouts/layouts.module";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { TestPaymentComponent } from "./test-payment/test-payment.component";
import { PayeReceiptComponent } from "./paye-receipt/paye-receipt.component";
import { DatatableScrollComponent } from "./datatable-scroll/scroll.component";

import { QRCodeModule } from "angularx-qrcode";

const components = [
	BtnLoadingComponent,
	FeatherIconComponent,
	BreadcrumbComponent,
	SearchIconComponent,
	RecaptchaComponent,
	TaxEnumerationCardComponent,
	CreateDataCategoryCardComponent,
	TestPaymentComponent,
	PayeReceiptComponent,
	DatatableScrollComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		LayoutsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		SearchModule,
		PerfectScrollbarModule,
		QRCodeModule,
		NgbModule,
	],
	declarations: components,
	exports: components,
})
export class SharedComponentsModule {}
