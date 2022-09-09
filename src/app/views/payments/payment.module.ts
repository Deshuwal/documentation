import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QRCodeModule } from "angularx-qrcode";
import { PaymentRoutingModule } from "./payment-routing-module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { PresumptiveBulkPaymentComponent } from "./bulk_presumptive_payments/bulk_payment.component";
import { PresumptiveBulkPaymentHistoryComponent } from "./bulk_presumptive_payments_history/bulk_payment.component";
import { PaymentComponent } from "./payments/payment.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { PaymentHistoryComponent } from "./payment_history/payment-history.component";
import { AgentTransactionsComponent } from "./agent-transactions/agent-transactions.component";
import { PAYEBulkPaymentHistoryComponent } from "./bulk_paye_payments _history/bulk_payment.component";
import { WalletComponent } from "./wallet/wallet.component";
import { TINHistoryComponent } from "./tin_history/tin-history.component";
import { PAYEBulkPaymentComponent } from "./bulk_paye_payments/bulk_payment.component";
import { CsvModule } from "@ctrl/ngx-csv";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { Manage_usersComponent } from "./manage_agents/manage_users.component";
import { PreviousLGCRevenuePaymentsComponent } from "./previous-LGC-Revenue-payments/previous-LGC-Revenue-payments.component";
import { PaymentLgcRevenueComponent } from "./payments_lgc_revenues/payments_lgc_revenues.component";
import { PaymentDownloadComponent } from "./payment_download/payment_download.component";
import { PaymentReceiptComponent } from './payment-receipt/payment-receipt.component';

@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgxDatatableModule,
		NgbModule,
		PaymentRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgSelectModule,
		SelectDropDownModule,
		CsvModule,
		SharedPipesModule,
		QRCodeModule,
	],

	declarations: [
		PaymentComponent,
		PaymentHistoryComponent,
		WalletComponent,
		AgentTransactionsComponent,
		TINHistoryComponent,
		PAYEBulkPaymentComponent,
		Manage_usersComponent,
		PAYEBulkPaymentHistoryComponent,
		PresumptiveBulkPaymentComponent,
		PresumptiveBulkPaymentHistoryComponent,
		PreviousLGCRevenuePaymentsComponent,
		PaymentLgcRevenueComponent,
		PaymentDownloadComponent,
		PaymentReceiptComponent,
	],
	exports: [FormsModule],
})
export class PaymentModule {}
