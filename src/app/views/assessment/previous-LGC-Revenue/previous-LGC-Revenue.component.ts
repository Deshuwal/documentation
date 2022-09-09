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
import { ItemsList } from "@ng-select/ng-select/lib/items-list";
import moment from "moment";
@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./previous-LGC-Revenue.component.html",
	styleUrls: ["./previous-LGC-Revenue.component.scss"],
	animations: [SharedAnimations],
})
export class PreviousLGCRevenueComponent implements OnInit {
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
	@ViewChild("modalBillingRef", { static: false })
	private billingRef;
	@ViewChild("xlsxtable", { static: false }) table: ElementRef;
	modal: NgbModal;

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

		this.breadcrumb.setCrumbItem("previouslgcrevenues");

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

	exportToExcel() {
		// new ngxCsv(data, "My Report");
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

		let url = "/Lgc_revenues/list";

		this.dl.doGet(url).subscribe(
			(res: any) => {
				this.filteredItems = res.data.map((item, idx) => ({
					...item,
					sn: idx + 1,
				}));
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

	assessmentForDisplay: any = {};
	displayPayee: any;
	displayDirect: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;
	data: any;
	viewAssessment(assessment: any) {
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
	parseDate(date) {
		return moment.utc(date).format("MM/DD/YYYY");
	}

	openAssessment() {
		this.router.navigateByUrl("/assessment/lgc-revenue");
	}

	formatNumber(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}

	download(div) {
		this.printPdf.downloadAssessment(div);
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
				this.assessments = res.list;
				this.filteredItems = [...this.assessments];

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
}
