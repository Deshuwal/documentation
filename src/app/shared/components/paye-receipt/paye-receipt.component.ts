import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
	BreadcrumbService,
	IBreadCrumbData,
} from "../../services/breadcrumb.service";
import { HttpService } from "../../services/http.service";
import { Environment } from "src/app/shared/models/environment";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PrintpdfService } from "../../services/printpdf.service";
import { Utils } from "src/app/shared/utils";

@Component({
	selector: "paye-receipt",
	templateUrl: "./paye-receipt.component.html",
	styleUrls: ["./paye-receipt.component.scss"],
})
export class PayeReceiptComponent implements OnInit {
	breadItem: IBreadCrumbData;

	@Input()
	billingRef: string;

	@Input()
	bulkAssessmentTotal: number;

	@Input()
	amount: number;

	@Input()
	myAngularxQrCode = null;

	loading: boolean = false;

	result_validation: string = "";
	result_notification: string = "";

	menvironment: Environment = new Environment();

	@ViewChild("modalPaymentGateways", { static: false })
	private modalPaymentGateways;

	@Input()
	assessmentForDisplay: any;

	displayThisComponent: boolean = false;
	constructor(
		private httpService: HttpService,
		private toastr: ToastrService,
		private router: Router,
		private modalService: NgbModal,
		private printPdf: PrintpdfService
	) {
		if (!this.menvironment.isOnLiveServer()) {
			this.displayThisComponent = true;
		}
	}

	ngOnInit() {
		this.myAngularxQrCode = `BRN: ${
			this.assessmentForDisplay.billing_ref
		} Payer Tin: ${
			this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
		}`;
	}

	//meta base
	downloadPDF(element) {
		this.printPdf.exportAsPDF(element, "payment");
	}

	printPDFS(element) {
		this.printPdf.printPdf(element);
	}

	chosePaymentMethod() {
		this.modalService.open(this.modalPaymentGateways, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}

	getTotalTax() {
		if (
			this.assessmentForDisplay.amount &&
			this.assessmentForDisplay.amount > 0
		)
			return this.assessmentForDisplay.amount;

		let taxRules: any = JSON.parse(
			this.assessmentForDisplay.rules ||
				"" +
					(+this.assessmentForDisplay.total_amount +
						+this.assessmentForDisplay.total_dev_levy)
		);
		return Number(taxRules.tax || taxRules).toFixed(2);
	}

	formatNumber(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	calculateTotalForSelectedBulkAssessment(bulk_id: any) {}
}
