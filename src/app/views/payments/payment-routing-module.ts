import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PaymentComponent } from "./payments/payment.component";
import { PaymentHistoryComponent } from "./payment_history/payment-history.component";
import { WalletComponent } from "./wallet/wallet.component";
import { AgentTransactionsComponent } from "./agent-transactions/agent-transactions.component";
import { AuthGaurd } from "src/app/shared/services/auth.gaurd";
import { TINHistoryComponent } from "./tin_history/tin-history.component";
import { PAYEBulkPaymentComponent } from "./bulk_paye_payments/bulk_payment.component";
import { PAYEBulkPaymentHistoryComponent } from "./bulk_paye_payments _history/bulk_payment.component";
import { PresumptiveBulkPaymentComponent } from "./bulk_presumptive_payments/bulk_payment.component";
import { PresumptiveBulkPaymentHistoryComponent } from "./bulk_presumptive_payments_history/bulk_payment.component";
import { Manage_usersComponent } from "./manage_agents/manage_users.component";
import { PreviousLGCRevenuePaymentsComponent } from "./previous-LGC-Revenue-payments/previous-LGC-Revenue-payments.component";
import { PaymentLgcRevenueComponent } from "./payments_lgc_revenues/payments_lgc_revenues.component";
import { PaymentDownloadComponent } from "./payment_download/payment_download.component";
import { PaymentReceiptComponent } from './payment-receipt/payment-receipt.component';

const routes: Routes = [
	{
		path: "all",
		component: PaymentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "verify/:ref/:orderNo",
		component: PaymentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: ":ref/download",
		component: PaymentDownloadComponent,
		//canActivate: [AuthGaurd],
	},
	{
		path: "payment-history",
		component: PaymentHistoryComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "previous-lgc-revenue-payments",
		component: PreviousLGCRevenuePaymentsComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "lgc-revenue-payments",
		component: PaymentLgcRevenueComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "tin-history",
		component: TINHistoryComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-paye-payments",
		component: PAYEBulkPaymentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-paye-payments-history",
		component: PAYEBulkPaymentHistoryComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-presumptive-payments",
		component: PresumptiveBulkPaymentComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "bulk-presumptive-payments-history",
		component: PresumptiveBulkPaymentHistoryComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "transactions",
		component: AgentTransactionsComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "wallet",
		component: WalletComponent,
		canActivate: [AuthGaurd],
	},

	{
		path: "manage-agents",
		component: Manage_usersComponent,
		canActivate: [AuthGaurd],
	},
	{
		path: "payment-receipt",
		component: PaymentReceiptComponent,
		canActivate: [AuthGaurd],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PaymentRoutingModule {}
