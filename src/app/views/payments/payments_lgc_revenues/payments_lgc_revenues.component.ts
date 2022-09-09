import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { Page } from "src/app/shared/models/Page";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";
import moment from "moment";
@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./payments_lgc_revenues.component.html",
	styleUrls: ["./payments_lgc_revenues.component.scss"],
	animations: [SharedAnimations],
})
export class PaymentLgcRevenueComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	gatewayForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	taxItems: any;

	pagination: Page = new Page();

	@ViewChild("modalConfirm", { static: false }) private modalContent;
	@ViewChild("modalPaymentGateways", { static: false })
	private modalPaymentGateways;
	@ViewChild("modalBillingRef", { static: false }) private billingRef;
	@ViewChild("xlsxtable", { static: false }) table: ElementRef;
	modal: NgbModal;
	data: any;
	userProfile: any;

	searchControl: FormControl = new FormControl();
	filteredItems: any[] = [];

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private router: Router,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService,
		private printPdf: PrintpdfService,
		private headTitle: Title
	) {}

	shouldVerifyPaymentStatus() {
		let url = window.location.href;

		return url.indexOf("verify") > 0;
	}

	setPage(info: any) {
		console.log("clicked set page", info);
		this.pagination.setCurrentPage(info.offset);

		console.log("pagination now at " + this.pagination.currentPage);

		this.filterByDate(false);
	}

	ngOnInit() {
		this.headTitle.setTitle("Payments");
		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("paymentAll");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.route.params.subscribe((params) => {
			this.status = params["status"];
			if (!this.shouldVerifyPaymentStatus() && this.status) {
				this.loadAssessments(); // reset and set based on new parameter this time
			}
		});

		var shouldVerifyPayment: boolean = this.shouldVerifyPaymentStatus();

		if (shouldVerifyPayment) {
			this.verifyPayment();
		} else {
			this.loadAssessments();
		}

		this.taxItemForm = this.fb.group({
			id: [""],
			title: ["", Validators.required],
			mda_id: ["", Validators.required],
			rules: [""],
		});

		this.gatewayForm = this.fb.group({
			gateway: ["", Validators.required],
		});
		this.loadMdas();
		this.loadTaxItems();
		this.route.queryParams.subscribe((params) => {
			if (params.billing_ref) {
				this.localStore.setItem("billToPay", params.billing_ref);
				window.location.href = window.location.href.split("?")[0];
				window.location.reload();
			}
		});
	}

	downloadPDF(element) {
		this.printPdf.exportAsPDF(element, "payment");
	}

	printPDFS(element) {
		this.printPdf.printPdf(element);
	}

	parseDate(date) {
		return moment.utc(date).format("MM/DD/YYYY");
	}

	getCustomTaxItem(item) {
		let desc = JSON.parse(item.rules);

		if (desc && desc.description) {
			return desc.description;
		}

		return "Unspecified";
	}

	verifyPayment() {
		let referenceNo = "";

		this.route.params.forEach((e: any) => {
			referenceNo = e.ref;
		});

		this.loading = true;

		let data: any = {};
		data.reference = referenceNo;

		this.toastr.info(
			"Verifying Payment for Billing Ref: " + data.reference,
			"Verifying Payment...",
			{
				timeOut: 3000,
			}
		);

		this.dl.doPostPaymentsServer("/opay/check_webpay_status", data).subscribe(
			(res: any) => {
				if (res && res.data && res.data.status == "SUCCESS") {
					this.toastr.success(
						"Payment Completed! ",
						"Confirmed Payment for BRN: " + data.reference,
						{
							timeOut: 5000,
						}
					);

					this.router.navigateByUrl("payment/payment-history");
				} else {
					this.toastr.error("Please try again", "Payment Not Successful ", {
						timeOut: 5000,
					});

					this.router.navigateByUrl("payment/all");
				}
			},
			(error) => {
				this.loading = false;
				console.log("error saving tax item", error);

				this.toastr.error("Please try again", "Payment Not Successful ", {
					timeOut: 5000,
				});

				this.router.navigateByUrl("payment/all");
			}
		);
	}

	getCustomTaxItemForDisplay(item) {
		console.log(item, "fetching");
	}

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}

	submitTaxItem() {
		if (
			this.taxItemForm.value.mda_id == null ||
			parseInt(this.taxItemForm.value.mda_id) < 1
		) {
			return;
		}

		this.loading = true;

		console.log("submitting tax item ", this.taxItemForm.value);

		this.dl.doPost("/tax_items/save", this.taxItemForm.value).subscribe(
			(res) => {
				console.log("result saving", res);
				this.editMode = false;
				this.loading = false;
				this.loadTaxItems();
			},
			(error) => {
				this.loading = false;
				console.log("error saving tax item", error);
			}
		);
	}

	loadTaxItems() {
		this.loading = true;
		this.dl.doGet("/tax_items/list").subscribe(
			(res) => {
				//console.log("fetched taxitems ", res);
				this.taxItems = res;
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	print() {
		window.print();
	}

	excelArray: any = [];

	loadAssessments() {
		this.loading = true;

		let url = "Lgc_revenues/list";

		if (this.status != undefined) {
			url = url + "/" + this.status;
		}

		this.dl.doGet(url).subscribe(
			(res: any) => {
				console.log("result pending ", res);
				if (res.data < 1) {
					this.toastr.info("No Pending Payments yet!", "Empty!", {
						timeOut: 3000,
					});
				}
				this.filteredItems = res.data.map((item, idx) => ({
					...item,
					sn: idx + 1,
				}));
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	loadMdas() {
		this.loading = true;
		this.dl.doGet("/mdas/list").subscribe(
			(res) => {
				this.mdas = res;
				this.loading = false;
				// console.log("fetched this.mda ", this.mdas);
			},
			(err) => {
				this.loading = false;
				console.log("error fetching mda", err);
			}
		);
	}

	taxItemItem: any = null;
	onTaxItemSelect(e) {
		this.taxItemItem = e.value.id;
	}

	assessmentForDisplay: any = {};
	displayPayee: any;
	displayDirect: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;

	viewAssessment(assessment: any) {
		console.log({ assessment });
		this.data = assessment;
		this.openConfirmModal();
	}

	openConfirmModal() {
		this.modalService
			.open(this.modalContent, { ariaLabelledBy: "Assessment Result" })
			.result.then(
				(result) => {
					this.modal = result;
					// console.log(result);
				},
				(reason) => {
					// console.log("Err!", reason);
				}
			);
	}

	chosePaymentMethod() {
		this.modalService.open(this.modalPaymentGateways, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}

	addGateway(assessmentNumber) {
		console.log({ assessmentNumber });
		console.log({ gatewayFormValid: assessmentNumber });
		if (this.gatewayForm.valid) {
			if (
				this.gatewayForm.valid &&
				this.gatewayForm.value.gateway === "PAYSTACK"
			) {
				this.makePaymentForTaxItem(assessmentNumber);
				this.modalService.dismissAll("dismisse");
			} else if (this.gatewayForm.value.gateway === "OPAY") {
				this.modalService.dismissAll("dismisse");
				this.makePaymentForTaxItemViaOpayWebPay(
					this.assessmentForDisplay.billing_ref
				);
			} else if (this.gatewayForm.value.gateway === "E-WALLET") {
				this.modalService.dismissAll("dismisse");
				this.makePaymentForTaxItemViaEWallet(
					this.assessmentForDisplay.billing_ref
				);
			}
		}
	}

	makePaymentForTaxItemViaOpayWebPay(assessmentNumber) {
		let url: string = "opay/initialize_web_transaction/";

		let data: any = {};
		let returnUrl = this.getPaymentsReturnUrl(
			this.assessmentForDisplay.billing_ref
		);

		console.log("return url ", returnUrl, { data: this.assessmentForDisplay });

		data.reference_no = this.assessmentForDisplay.billing_ref;
		data.tax_item = "Plateau State Internal Revenue Service";
		data.return_url = returnUrl;

		//if paye; divide by 12
		//@Todo; divide by the number of months in PERIOD parameter
		if (this.assessmentForDisplay.tax_item == "PAYE") {
			console.log("this is paye", this.displayPayee);
			this.assessmentForDisplay.rules.tax = Number(this.displayPayee.paye);
			data.amount =
				(Number(this.displayPayee.paye) +
					this.assessmentForDisplay.rules.dev_levy) *
				100;

			/* (this.assessmentForDisplay.rules.tax +
          this.assessmentForDisplay.rules.dev_levy) *
        100; */
		} else {
			data.amount = this.assessmentForDisplay.amount * 100;
		}

		console.log("sending data ", data);
		data.call_back_url = window.location.href;
		this.loading = true;
		this.dl.doPostPaymentsServer(url, data).subscribe(
			(res: any) => {
				this.loading = false;

				console.log("response from payments ", res);

				if (res && res.data && res.data.cashierUrl) {
					let url = res.data.cashierUrl;
					console.log("redirecting to ", url);

					setTimeout(() => {
						window.location.replace(url);
						//window.open(url, "popup", "width=600,height=600");
					}, 2000);

					this.toastr.info("Complete payment with opay", "Redirecting...", {
						timeOut: 10000,
						closeButton: true,
						progressBar: true,
					});
					this.loading = true;
				}
			},
			(err) => {
				console.log("error getting init url ", err);
				this.loading = false;
				this.toastr.error("Failed!", "Payment Failed", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
			}
		);
	}

	makePaymentForTaxItemViaEWallet(assessmentNumber) {
		let url: string = "walletPay/make_payment";

		let data: any = {};
		let returnUrl = this.getPaymentsReturnUrl(
			this.assessmentForDisplay.billing_ref
		);

		data.billing_ref = this.assessmentForDisplay.billing_ref;
		data.agent_id = this.userProfile.id;

		console.log("data ", data);

		this.loading = true;
		this.dl.doPostPaymentsServer(url, data).subscribe(
			(res: any) => {
				this.loading = false;

				console.log("response from payments ", res);

				if (res && res.status == "paid") {
					this.toastr.success(
						"Payment Completed Successfully!",
						"Redirecting...",
						{
							timeOut: 10000,
							closeButton: true,
							progressBar: true,
						}
					);
					this.loading = true;
					this.router.navigateByUrl("payment/payment-history");
				} else {
					this.toastr.error(res.reason, "Error!", {
						timeOut: 10000,
						closeButton: true,
						progressBar: true,
					});
					this.loading = false;
				}
			},
			(err) => {
				console.log("error getting init url ", err);

				let errMessage: string =
					err && err.error.reason ? err.error.reason : "Payment Failed";
				this.loading = false;
				this.toastr.error("Failed!", errMessage, {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
			}
		);
	}

	getPaymentsReturnUrl(ref: string, orderNo: string = null) {
		let currentUrl = window.location.href.split("/payment")[0];

		return currentUrl + "/payment/verify/" + ref + "/" + orderNo;
	}

	makePaymentForTaxItem(itemId: number) {
		console.log("gotten id ", itemId);

		let item = this.getPaymentItem(itemId);
		let amount = 0;

		console.log(item);

		//checking if this is paye
		if (item.mda_id == 3 && item.tax_item_id == 13) {
			amount = item.rules.tax;
		} else {
			amount = item.amount * 100;
		}
		let win: any = window;
		this.pendingItem = item;
		console.log("gotten id ", amount);

		win.payWithPaystack(amount, this);
	}

	pendingItem: any;
	paymentSucceeded() {
		console.log("updating ", this.assessmentForDisplay.id);
		this.loading = true;

		let url: string = "/assessment/update_assessment/" + this.pendingItem.id;
		url = url + "/1" + "/" + this.gatewayForm.value.gateway;
		console.log("url is ", url);
		this.dl.doGet(url).subscribe(
			(res) => {
				this.loading = false;
				this.toastr.success("Success", "Payment Successful!", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
				this.router.navigateByUrl("/assessment/history");
			},
			(err) => {
				this.loading = false;
				this.toastr.error(
					"Failed!",
					err.reason ? err.reason : "Payment failed",
					{
						timeOut: 10000,
						closeButton: true,
						progressBar: true,
					}
				);
				this.modalService.dismissAll("dismiss");
			}
		);
	}

	openAssessment() {
		this.router.navigateByUrl("/assessment/perform");
	}

	getPaymentItem(id: number) {
		console.log("Getting assessment ", id, this.assessments);
		// this.assessments = this.assessments || [];

		for (let i: number = 0; i < this.assessments.length; i++) {
			let thisId: number = parseInt(this.assessments[i].id);
			console.log("comparing ", thisId, id);
			if (thisId == id) {
				return this.assessments[i];
			}
		}

		return null;
	}

	editTaxItem(taxItem: any = null) {
		if (taxItem) {
			this.editTitle = "Edit TaxItem";
			this.taxItemForm.setValue({
				id: taxItem.id,
				rules: taxItem.rules,
				title: taxItem.title,
				mda_id: taxItem.mda_id,
			});
		} else {
			this.editTitle = "Create TaxItem";
			this.taxItemForm.setValue({ title: "", mda_id: "", id: "", rules: "" });
		}

		this.editMode = true;
	}

	payBillingRef() {
		this.modalService.open(this.billingRef, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}

	payWithBillingRef() {
		this.loading = true;

		setTimeout(() => {
			this.toastr.error("Billing Ref not found", "Error!", { timeOut: 3000 });
			this.loading = false;
		}, 5000);
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}

	BRNField: string;
	searchField: string;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	selectedMDA: any = null;
	paymentTotal: number = 0;
	from: string;
	to: string;

	config = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 5,
		placeholder: "Filter by mda",
		noResultsFound: "No results!",
	};

	configPGW = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 5,
		placeholder: "Select Gateway",
		noResultsFound: "No results!",
	};

	configsTaxItem = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 5,
		placeholder: "Filter by tax Item",
		noResult: "No results !",
	};

	onBRNnSearch(e) {
		this.BRNField = e.target.value;
	}

	onSearch(e) {
		this.searchField = e.target.value;
	}

	filterByDate(resetPagination: boolean = false) {
		if (resetPagination) {
			this.pagination.setCurrentPage(0);
		}
		this.loading = true;
		let url =
			"payments/filter_pending_for_user/" +
			this.userProfile.id +
			"?page=" +
			this.pagination.currentPage;

		url = `${url}&to=${this.to}&from=${this.from}`;
		if (this.selectedMDA != null) {
			url = `${url}&mda_id=${this.selectedMDA}`;
		}

		if (this.searchField) {
			url = `${url}&search=${this.searchField}`;
		}

		this.dl.doGet(url).subscribe(
			(res: any) => {
				console.log("result filtering ", res);
				if (res.length < 1) {
					this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
				}
				this.pagination.totalItemCount = res.items_count;

				this.filteredItems = res.data;

				this.paymentTotal = this.filteredItems.reduce(
					(acc, pmt) => acc + parseInt(pmt.amount),
					0
				);
				this.loading = false;
			},
			(err) => {
				this.loading = false;
			}
		);
	}

	onMDASelect(event) {
		this.selectedMDA = event.value.id;
	}

	getButtonIdentifierForE2EPaymentButton(row: any) {
		let item: string = row.tax_item
			? row.tax_item
			: this.getCustomTaxItem(row) + " -" + row.description;

		if (item.trim().toLowerCase() == "others") {
			item += " -" + row.description;
		}
		return Utils.convertTextToCssSelectorForE2E(item);
	}
}
