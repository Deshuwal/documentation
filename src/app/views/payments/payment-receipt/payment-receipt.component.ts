import { Component, OnInit, ViewChild } from "@angular/core";
import { Injectable, isDevMode } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Injectable({
  providedIn: "root",
})

@Component({
  selector: 'app-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent implements OnInit {

  @ViewChild("modalConfirm", { static: false }) public modalContent;
  @ViewChild("modalPaye", { static: false }) private modalPaye;

  userProfile: any;
  public myAngularxQrCode: string = null;

  constructor(
		private modalService: NgbModal,
		private assessmentService: AssessmentService,
		private localStore: LocalStoreService,
		private breadcrumb: BreadcrumbService,
		private printPDF: PrintpdfService,
	) {}

  
  ngOnInit() {
	this.userProfile = this.localStore.getItem("user");
  }

  handleClick(){
    this.modalService.open(this.modalContent, {
		ariaLabelledBy: "modal-basic-title",
		centered: true,
	});
  }

  assessmentForDisplay: any = {};
  displayPayee: any;
  payeeSummary: boolean = false;
  directAssessmentSummary: boolean = false;
  dynamicSummary: boolean = false;


  setAssessmentView(assessment: any, obj: any) {
		this.payeeSummary = false;
		this.directAssessmentSummary = false;
		this.assessmentForDisplay = Object.assign({}, assessment);

		this.assessmentForDisplay.name =
			this.assessmentForDisplay.payer_name || this.assessmentForDisplay.name;

		//handle bulk seperately
		if (assessment.bulk_id && assessment.bulk_id > 0) {
			console.log(assessment);

			this.setPayeAssessmentView(assessment);
			return;
		}

		//if assessment is payee or licence
		if (assessment.tax_item_id == 13) {
			this.dynamicSummary = true;
			this.payeeSummary = true;

			try {
				this.assessmentForDisplay.rules = JSON.parse(
					this.assessmentForDisplay.rules
				);

				// this.assessmentForDisplay =  assessment.rules;
			} catch (e) {}

			this.assessmentForDisplay.form_items = JSON.parse(
				this.assessmentForDisplay.form_items
			);

			this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
				this.assessmentForDisplay.form_items,
				JSON.parse(assessment.rules)
			);
			this.displayPayee.payment_channel =
				this.assessmentForDisplay.payment_channel;

			this.assessmentForDisplay.tin = this.userProfile.tin;

			this.modalService.open(this.modalContent, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
			});

			return;
		} else if (
			assessment.rules &&
			assessment.rules.length < 3 &&
			assessment.tax_item_id == 14
		) {
			this.displayPayee =
				this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
					JSON.parse(assessment.form_items)
				);

			this.dynamicSummary = true;
			this.directAssessmentSummary = true;

			this.modalService.open(this.modalContent, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
			});

			return;
		}

		this.dynamicSummary = false;
		this.assessmentForDisplay.expiryYear = new Date(
			assessment.created_at * 1000
		).getFullYear();
		this.assessmentForDisplay.name = assessment.name;
		this.assessmentForDisplay.billing_ref = assessment.billing_ref;
		this.assessmentForDisplay.id = assessment.id;
		// this.assessmentForDisplay.payer_name = assessment.payer_name;
		this.assessmentForDisplay.mda = assessment.mda;
		// this.assessmentForDisplay.first_name = assessment.first_name;
		// this.assessmentForDisplay.surname = assessment.surname;

		let parsedDescription = JSON.parse(assessment.rules) || {};

		this.assessmentForDisplay.description =
			parsedDescription.description || assessment.description;
		this.assessmentForDisplay.tax_item = assessment.display
			? JSON.parse(assessment.display).tax_item
			: assessment.tax_item
			? assessment.tax_item
			: this.getCustomTaxItem(assessment);
		this.assessmentForDisplay.tin = assessment.tin;
		this.assessmentForDisplay.amount = assessment.amount;

		console.log("mooooooo", this.assessmentForDisplay);
		this.myAngularxQrCode = `BRN: ${
			this.assessmentForDisplay.billing_ref
		} Payer Tin: ${
			this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
		}`;

		//add date to assessmnt got display

		this.assessmentForDisplay.start_tax_period = JSON.parse(assessment.display)
			? JSON.parse(assessment.display).start_tax_period
			: null;
		this.assessmentForDisplay.end_tax_period = JSON.parse(assessment.display)
			? JSON.parse(assessment.display).end_tax_period
			: null;

		this.modalService.open(this.modalContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}

  setPayeAssessmentView(assessment: any) {
		this.payeeSummary = false;
		this.directAssessmentSummary = false;

		this.assessmentForDisplay = Object.assign({}, assessment);

		console.log("objectfff", assessment);

		//if assessment is payee or licence

		this.dynamicSummary = true;
		this.payeeSummary = true;

		this.assessmentForDisplay = Object.assign({}, assessment);
		this.assessmentForDisplay.status = assessment.status;
		this.assessmentForDisplay.bulk_name = assessment.bulk_name;
		this.assessmentForDisplay.tin =
			assessment.organization_tin || assessment.tin;
		this.assessmentForDisplay.name =
			assessment.organization_name || assessment.name;

		console.log("Display Payee", this.assessmentForDisplay);
		this.calculateTotalForSelectedBulkAssessment(assessment.id);
		this.myAngularxQrCode = `BRN: ${
			this.assessmentForDisplay.billing_ref
		} Payer Tin: ${
			this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
		}`;

		this.modalService.open(this.modalPaye, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});

		return;
		// }
	}

  calculateTotalForSelectedBulkAssessment(bulk_id: any) {
		/*	this.loading = true;
	
		let url = "assessment/list_bulk_paye_assessments/" + bulk_id;
	
		if (this.status != undefined) {
		  url = url + "/" + this.status;
		}
	
		this.dl.doGet(url).subscribe(
		  (res: any) => {
			if (res.length < 1) {
			  this.toastr.info(
				"This bulk item has no individual assessments! ",
				"Empty!",
				{ timeOut: 3000 }
			  );
			}
			let total = 0;
			res.forEach((item: any) => {
			  let individual = JSON.parse(item.rules);
			  total +=
				+Number(individual.tax / 12).toFixed(2) +
				+Number(individual.dev_levy).toFixed(2);
			});
			this.bulkAssessmentTotal = total;
			this.loading = false;
		  },
		  (err) => {
			this.loading = false;
			this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
		  }
		); */
	}

  getCustomTaxItem(item: any) {
		let desc = null;

		try {
			desc = JSON.parse(item.rules);
		} catch (error) {
			desc = null;
		}

		if (desc && desc.description) {
			return desc.description;
		}

		return "Unspecified";
	}

	downloadPDF(element) {
		this.printPDF.exportAsPDF(element, "Payment");
	}
	printPdf(element) {
		this.printPDF.printNoticeAssMent(element);
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}
}
