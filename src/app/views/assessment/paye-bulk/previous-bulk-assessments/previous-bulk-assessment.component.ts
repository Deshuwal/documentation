import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbDate, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { Page } from "src/app/shared/models/Page";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./previous-bulk-assessment.component.html",
	styleUrls: ["./previous-bulk-assessment.component.scss"],
	animations: [SharedAnimations],
})
export class PreviousBulkAssessmentComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	assessmentsForSelectedBulk: any;
	bulkPayeItems: any;
	pagination: Page = new Page();

	filteredItems: any[] = [];
	filteredSelectedItems: any[] = [];

	searchControl: FormControl = new FormControl();

	@ViewChild("modalConfirm", { static: false }) private modalContent;
	@ViewChild("modalPaymentGateways", { static: false })
	private modalPaymentGateways;
	@ViewChild("modalBillingRef", { static: false }) private billingRef;

	userProfile: any;

	searching: boolean = false;

	bulkAssessmentTotal: number = 0;

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private printpdfService: PrintpdfService,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private router: Router,
		private breadcrumb: BreadcrumbService
	) {}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("assessmentHistory");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.route.params.subscribe((params) => {
			this.status = params["status"];
			this.loadAssessments(); // reset and set based on new parameter this time
		});

		this.loadAssessments();
		this.loadBulkPayeItems();
	}

	getCustomTaxItem(item) {
		if (item.length) {
			let desc = JSON.parse(item.rules);
			if (desc && desc.description) {
				return desc.description;
			}
		}

		return "PAYE";
	}

	BRNField: string;
	searchField: string;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	selectedMDA: any = null;
	paymentTotal: number = 0;
	from: string;
	to: string;
	filterByDate(resetPagination: boolean = false) {
		if (resetPagination) {
			this.pagination.setCurrentPage(0);
		}
		this.loading = true;
		let url =
			"assessment/filter_pending_for_paye/" +
			this.userProfile.id +
			"?page=" +
			this.pagination.currentPage;

		url = `${url}&to=${this.to}&from=${this.from}`;

		if (this.searchField) {
			url = `${url}&search=${this.searchField}`;
		}

		console.log({ url });

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

	onSearch(e) {
		this.searchField = e.target.value;
	}

	getCustomTaxItemForDisplay(item) {
		console.log(item, "fetching");
	}

	loadBulkPayeItems() {
		this.loading = true;
		this.dl.doGet("/assessment/list_bulk_paye").subscribe(
			(res) => {
				console.log("fetched loadBulkPayeItems ", res);
				this.bulkPayeItems = res;
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

	loadAssessments() {
		this.loading = true;

		let url = "/assessment/list_bulk_paye_for_user/" + this.userProfile.id;

		if (["1", "3"].includes(this.userProfile.role)) {
			url = "/assessment/list_bulk_paye";
		}

		if (this.status != undefined) {
			url = url + "/" + this.status;
		}

		this.dl.doGet(url).subscribe(
			(res: any) => {
				if (res.length < 1) {
					this.toastr.info("No Assessments yet!", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res;
				this.filteredItems = [...this.assessments];
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	assessmentForDisplay: any = {};
	displayPayee: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;

	viewAssessment(assessment: any) {
		// console.log('nannnnnnnnnnnnn', assessment);
		this.assessmentForDisplay = Object.assign({}, assessment);
		this.assessmentForDisplay.status = assessment.status;
		this.assessmentForDisplay.bulk_name = assessment.bulk_name;
		this.assessmentForDisplay.tin =
			assessment.organization_tin || assessment.tin;
		this.assessmentForDisplay.name =
			assessment.organization_name || assessment.name;
		this.modalService.open(this.modalContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
		this.calculateTotalForSelectedBulkAssessment(assessment.id);
		// console.log("Assessment for display", this.assessmentForDisplay);
	}

	goToViewAssessments(bulk_id: any, tin: any, billing_ref: any) {
		this.modalService.dismissAll();
		this.router.navigateByUrl(
			"assessment/view-bulk-paye-assessments/" +
				bulk_id +
				"/" +
				tin +
				"/" +
				billing_ref
		);
	}

	monthNames: string[] = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	getDate(dateString: string) {
		const date = dateString.split("-");
		const year = date[0];
		const month = Number(date[1]);
		return ` ${this.monthNames[month - 1]}, ${year}`;
	}

	makePaymentForTaxItem() {
		const item = this.assessmentForDisplay;
		let amount = item.amount;
		if (item.mda_id == 3 && item.tax_item_id == 13) {
			amount = item.rules.tax;
		}
		let win: any = window;
		win.payWithPaystack(Math.ceil(amount), this);
	}

	generateDemandNotice(bulk_id: any) {
		// const item = this.assessmentForDisplay;
		// console.log("Notice Demanded", item);
		this.loading = true;
		let url: string = `assessment/generate_bulk_paye_demand_notice/${bulk_id}`;

		this.dl.doGet(url).subscribe(
			(res) => {
				this.loading = false;
				console.log("Generated Demand Notice", res);
				this.toastr.success("Success", "Demand Notice Generated Successful!", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
				this.loadAssessments();
			},
			(err) => {
				// console.log("error dey", err);
				this.loading = false;
				this.toastr.error("Failed!", "Failed to generate Demand Notice", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
			}
		);
	}

	printDoc(div) {
		this.printpdfService.printNoticeAssMent(div);
	}
	downloadDoc(div) {
		this.printpdfService.downloadAssessment(div);
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x
			? x
					.toFixed(2)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			: x;
	}

	window = window;

	calculateTotalForSelectedBulkAssessment(bulk_id: any) {
		this.loading = true;
		this.bulkAssessmentTotal = 0;
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

				res.forEach((item: any) => {
					let individual = JSON.parse(item.rules);
					this.bulkAssessmentTotal += individual.tax;
				});

				this.loading = false;
			},
			(err) => {
				this.loading = false;
				this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
			}
		);
	}

	chosePaymentMethod() {
		this.modalService.open(this.modalPaymentGateways, {
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
}
