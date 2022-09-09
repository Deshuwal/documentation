import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { Page } from "src/app/shared/models/Page";
import { Exporter } from "src/app/shared/models/exporter";
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

import { ActivatedRoute, Router } from "@angular/router";

import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { stringify } from "@angular/compiler/src/util";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./payment_download.component.html",
	styleUrls: ["./payment_download.component.scss"],
	animations: [SharedAnimations],
})
export class PaymentDownloadComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	taxItems: any;
	paymentTotal: number = 0;
	showHeader = false;
	bulkAssessmentTotal: Number;
	pagination: Page = new Page();

	taxItemId: number = null;

	exporter: Exporter = new Exporter();

	@ViewChild("modalConfirm", { static: false }) private modalContent;

	@ViewChild("modalPaye", { static: false }) private modalPaye;

	userProfile: any;

	filteredItems: any[] = [];

	searchControl: FormControl = new FormControl();

	hoveredDate: NgbDate | null = null;
	public myAngularxQrCode: string = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	selectedMDA: any = null;

	from: string;
	to: string;

	config = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 5,
		placeholder: "Filter by MDA",
		noResultsFound: "No results found!",
	};

	configsTaxItem = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 15,
		placeholder: "Tax Item",
		noResult: "No results !",
	};

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private mRouter: Router,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private printPDF: PrintpdfService,
		private route: ActivatedRoute,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService
	) { }

	checkIfReceitpRequest() {
		let url = window.location.href;
		return url.indexOf("download") > 0;
	}

	dateFromString(s) {
		if (!s) return "N/A";

		let date = new Date(s * 1000);
		return (
			("0" + date.getDate()).slice(-2) +
			"/" +
			("0" + (date.getMonth() + 1)).slice(-2) +
			"/" +
			date.getFullYear() +
			" " +
			("0" + date.getHours()).slice(-2) +
			":" +
			("0" + date.getMinutes()).slice(-2)
		);
	}

	ngOnInit() {
		
		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.route.params.subscribe((params) => {
			this.status = params["status"];
		});

		var loadReceipt: boolean = this.checkIfReceitpRequest();
		if (loadReceipt) {
			this.loadReceipt()
		} 

		this.taxItemForm = this.fb.group({
			id: [""],
			title: ["", Validators.required],
			mda_id: ["", Validators.required],
			rules: [""],
		});

		this.searchControl.valueChanges.subscribe((value: string) => {
			if (value.length < 1) {
				this.filteredItems = [...this.assessments];
			} else {
				this.filteredItems = [];
				this.filteredItems = [...this.assessments];
			}

			let newList: any[] = [];

			value = value.toLowerCase();

			this.filteredItems.forEach((e) => {
				if (
					(e.name && e.name.toLowerCase().indexOf(value) > -1) ||
					(e.tax_item && e.tax_item.toLowerCase().indexOf(value) > -1) ||
					(e.mda && e.mda.toLowerCase().indexOf(value) > -1) ||
					(e.address && e.address.toLowerCase().indexOf(value) > -1) ||
					(e.industry && e.industry.indexOf(value) > -1)
				) {
					newList.push(e);
				}
			});

			this.filteredItems = newList;
		});
	}

	loadReceipt() {
		
		let referenceNo = "";

		this.loading = true;
		
		this.route.params.forEach((e: any) => {
			referenceNo = e.ref;
		  });

		let url = "payments/external_client_payment_status/" + referenceNo;

		this.dl.doGet(url).subscribe(
			(res: any) => {
				console.log("result fetching list", res);
				if (res.length < 1) {
					this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res;
				this.filteredItems = [...this.assessments];
				this.paymentTotal = res.total;
				this.pagination.setTotalItemCount(res.items_count);
				this.loading = false;
				setTimeout(()=>{

					this.viewAssessment(res[0]);

				}, 500);
			},
			(err) => {
				this.loading = false;
			}
		);
	}
	
	printDoc(id) {
		window.location.href =
			"https://psirs-38c0e2dc-07e8-11ec-9a031ff43ca0-006b-4d99-9f5c-74f72763.netlify.app/" +
			id;
	}

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}

	// submitTaxItem() {
	// 	if (
	// 		this.taxItemForm.value.mda_id == null ||
	// 		parseInt(this.taxItemForm.value.mda_id) < 1
	// 	) {
	// 		return;
	// 	}

	// 	this.loading = true;

	// 	this.dl.doPost("/tax_items/save", this.taxItemForm.value).subscribe(
	// 		(res) => {
	// 			this.editMode = false;
	// 			this.loading = false;
	// 			//this.loadTaxItems();
	// 		},
	// 		(error) => {
	// 			this.loading = false;
	// 		}
	// 	);
	// }

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

	getCustomTaxItemForDisplay(item: any) {
		// console.log(item, 'fetching');
	}

	// loadTaxItems() {
	// 	this.loading = true;
	// 	this.dl.doGet("/tax_items/list").subscribe(
	// 		(res) => {
	// 			this.taxItems = res;
	// 			this.loading = false;
	// 		},
	// 		(err) => {
	// 			this.loading = false;
	// 		}
	// 	);
	// }

	taxItemsSelected: any = [];

	fetchTaxItems(id) {
		this.loading = true;
		this.dl.doGet("/tax_items/list_for_mda/" + id).subscribe(
			(res) => {
				this.loading = false;
				this.taxItemsSelected = res;
			},
			(err) => {
				this.loading = false;
				console.log(err);
			}
		);
	}
	taxItemItem: any = null;
	payer_type: string = "Individual";
	onTaxItemSelect(e) {
		if (e.value && e.value.id) {
			this.taxItemId = e.value.id;
			console.log("tax item ", this.taxItemId);
		} else {
			this.taxItemId = null;
		}
	}

	setPage(info: any) {
		console.log("clicked set page", info);
		this.pagination.setCurrentPage(info.offset);
		console.log("pagination now at " + this.pagination.currentPage);

		this.filterByDate(false);
	}

	

	mda: any[] = [];

	// loadMdas() {
	// 	this.loading = true;
	// 	this.dl.doGet("/mdas/list").subscribe(
	// 		(res) => {
	// 			this.mdas = res;
	// 			console.log({ mdas: this.mdas });
	// 			this.mda = [
	// 				{ title: "All", id: null },
	// 				...this.mdas.map((el) => ({ title: el.title, id: el.id })),
	// 			];
	// 			this.loading = false;
	// 		},
	// 		(err) => {
	// 			this.loading = false;
	// 		}
	// 	);
	// }

	// deleteInvoice(id, modal) {
	// 	this.loading = true;
	// 	this.modalService
	// 		.open(modal, { ariaLabelledBy: "modal-basic-title", centered: true })
	// 		.result.then(
	// 			(result) => {
	// 				this.dl.doGet("/tax_items/delete/" + id).subscribe((res) => {
	// 					this.loading = false;
	// 					this.toastr.success("Tax Item Deleted!", "Success!", {
	// 						timeOut: 3000,
	// 					});
	// 					this.loadTaxItems();
	// 				});
	// 			},
	// 			(reason) => {
	// 				this.loading = false;
	// 			}
	// 		);
	// }

	assessmentForDisplay: any = {};
	displayPayee: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;

	viewPayeAssessment(assessment: any) {
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
		this.myAngularxQrCode = `BRN: ${this.assessmentForDisplay.billing_ref
			} Payer Tin: ${this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
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

	viewAssessment(assessment: any) {

		console.log("Tst" + JSON.stringify(assessment))
		this.payeeSummary = false;
		this.directAssessmentSummary = false;
		this.assessmentForDisplay = Object.assign({}, assessment);

		this.assessmentForDisplay.name =
			this.assessmentForDisplay.payer_name || this.assessmentForDisplay.name;

		//handle bulk seperately
		if (assessment.bulk_id && assessment.bulk_id > 0) {
			console.log(assessment);

			this.viewPayeAssessment(assessment);
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
			} catch (e) { }

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
		this.myAngularxQrCode = `BRN: ${this.assessmentForDisplay.billing_ref
			} Payer Tin: ${this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
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

	makePaymentForTaxItem(itemId: number) {
		// console.log('gotten id ', itemId);

		let item = this.getPaymentItem(itemId);

		let amount = 0;

		if (item.mda_id == 3 && item.tax_item_id == 13) {
			amount = item.rules.tax;
		}

		let win: any = window;
		this.pendingItem = item;
		win.payWithPaystack(amount, this);

		// console.log('Called paystack');
	}

	pendingItem: any;
	paymentSucceeded() {
		// console.log('updating ', this.assessmentForDisplay.id);
		this.loading = true;

		let url: string = "assessment/update_assessment/" + this.pendingItem.id;
		url = url + "/1";
		// console.log('url is ', url);
		this.dl.doGet(url).subscribe(
			(res) => {
				this.loading = false;
				this.toastr.success("Success", "Payment Successful!", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.modalService.dismissAll("dismiss");
			},
			(err) => {
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

	downloadPDF(element) {
		this.printPDF.exportAsPDF(element, "Payment");
	}
	printPdf(element) {
		this.printPDF.printNoticeAssMent(element);
	}

	getPaymentItem(id: number) {
		console.log("Getting assessment ", id, this.assessments);

		for (let i: number = 0; i < this.assessments.length; i++) {
			let thisId: number = parseInt(this.assessments[i].id);
			// console.log('comparing ', thisId, id);
			if (thisId == id) {
				return this.assessments[i];
			}
		}

		return null;
	}

	// editTaxItem(taxItem: any = null) {
	// 	if (taxItem) {
	// 		this.editTitle = "Edit TaxItem";
	// 		this.taxItemForm.setValue({
	// 			id: taxItem.id,
	// 			rules: taxItem.rules,
	// 			title: taxItem.title,
	// 			mda_id: taxItem.mda_id,
	// 		});
	// 	} else {
	// 		this.editTitle = "Create TaxItem";
	// 		this.taxItemForm.setValue({ title: "", mda_id: "", id: "", rules: "" });
	// 	}

	// 	this.editMode = true;
	// }

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}

	BRNField: string;
	searchField: string;
	onBRNnSearch(e) {
		this.BRNField = e.target.value;
	}

	onSearch(e) {
		this.searchField = e.target.value;
	}

	filterByDate(resetPagination: boolean = true) {
		this.loading = true;

		if (resetPagination) {
			this.pagination.setCurrentPage(0);
		}

		let url =
			"payments/list_completed_for_user/" +
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

		if (this.taxItemId) {
			url = `${url}&taxItem_id=${this.taxItemId}`;
		}

		this.dl.doGet(url).subscribe(
			(res: any) => {
				console.log("result filtering list ", res);
				if (res.payments_list.length < 1) {
					this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res.payments_list;
				this.filteredItems = [...this.assessments];
				this.paymentTotal = res.total;
				this.pagination.setTotalItemCount(res.items_count);
				this.loading = false;
			},
			(err) => {
				this.loading = false;
			}
		);
	}

	downloadFilter(resetPagination: boolean = true) {
		this.loading = true;

		return new Promise((resolve, reject) => {
			if (resetPagination) {
				this.pagination.setCurrentPage(0);
			}

			let url =
				"payments/download_completed_for_user/" +
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

			if (this.taxItemId) {
				url = `${url}&taxItem_id=${this.taxItemId}`;
			}

			this.dl.doGet(url).subscribe(
				(res: any) => {
					this.loading = false;
					console.log("result filtering list ", res);
					resolve(res);
				},
				(err) => {
					this.loading = false;
					reject(err);
				}
			);
		});
	}

	onMDASelect(event) {
		this.selectedMDA = event.value.id;
		this.fetchTaxItems(event.value.id);
	}

	export_button_label = "Export Results";
	exportToExcel() {
		this.export_button_label = "Exporting...";
		this.downloadFilter().then((downloadItems: any) => {
			console.log("download items ", downloadItems);
			let headers: string[] = [];
			headers.push("id");
			headers.push("mda");
			headers.push("tax_item");
			headers.push("user_id");
			headers.push("billing_ref");
			headers.push("status");
			headers.push("amount");
			headers.push("payer_tin");
			headers.push("payer_name");
			headers.push("created_by");
			//headers.push("bulk_paye_id");
			//headers.push("bulk_name");
			headers.push("payment_channel");
			headers.push("created_at");
			headers.push("payment_date");
			headers.push("period_from");
			headers.push("period_to");

			let csv = this.exporter.getCsVPaymentHistory(
				downloadItems.payments_list,
				headers
			);


			this.export_button_label = "Export Results";
			console.log("exporting", csv);
		});
	}

	saveAsExcelFile(buffer: any, fileName: string): void {
		import("file-saver").then((FileSaver) => {
			let EXCEL_TYPE =
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
			let EXCEL_EXTENSION = ".xlsx";
			const data: Blob = new Blob([buffer], {
				type: EXCEL_TYPE,
			});
			FileSaver.saveAs(
				data,
				fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
			);
		});
	}
}
