import { Component, OnInit, ViewChild } from "@angular/core";
import { echartStyles } from "src/app/shared/echart-styles";
import { ProductService } from "src/app/shared/services/product.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

interface SectorAuddit {
	expected_amount_monthly: number;
	name: string;
	id: number;
}

import {
	Router,
	RouteConfigLoadStart,
	ResolveStart,
	RouteConfigLoadEnd,
	ResolveEnd,
} from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./fixed_tax_items.component.html",
	styleUrls: ["./fixed_tax_items.component.scss"],
	animations: [SharedAnimations],
})
export class FixedTaxItemsComponent implements OnInit {
	mdas: any;
	fixedTaxItem: FormGroup;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	taxItems: any;
	isInputDisplayed = false;

	isTaxItemFixed:boolean;


	@ViewChild("addTaxItemModal", { static: false }) private taxItemModal;

	agents: any[] = [
		{ name: "Male", id: 102348 },

		{ name: "Female", id: 102348 },

		{ name: "Trans", id: 102348 },

		{ name: "Other", id: 102348 },
	];

	@ViewChild("modalConfirm", { static: false }) private modalContent;

	@ViewChild("modalCreate", { static: false }) private addModal;

	userProfile: any;

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService
	) {}


	toggleFixedAmount(){

		if(this.taxItemForm.value.isFixed=="true") {
			this.isTaxItemFixed = true;
		}
		else{
			this.isTaxItemFixed = false;
		}
	}

	ngOnInit() {
		console.log(
			"testing utils",
			Utils.getTimeIntervalPhpTimeStamp(Date.now() / 1000)
		);

		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("fixedTaxItems");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.loading = true;

		setTimeout(() => {
			this.loading = false;
		}, 4000);

		console.log("param is ", this.status);

		this.loadTaxItems();
		this.loadMdas();

		this.fixedTaxItem = this.fb.group({
			mda_id: [""],
			title: ["", Validators.required],
			amount: ["", Validators.required],
		});

		this.taxItemForm = this.fb.group({
			mda_id: ["", Validators.required],
			title: ["", Validators.required],
			isFixed:["", Validators.required],
			amount: [""],
		});

		
	}

	config = {
		displayKey: "title", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 50,
		moreText: "More",
		searchPlaceholder: "Search by TIN.",
		noResultsFound: "No results found!",
		searchOnKey: "tin",
	};

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}


	newTaxItem(){

		this.modalService.open(this.taxItemModal, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		  });

	}
	submitTaxItem() {
		console.log({ KKKKKK: this.fixedTaxItem.value });
		if (
			this.fixedTaxItem.value.mda &&
			parseInt(this.fixedTaxItem.value.mda.id) < 1
		) {
			return;
		}

		this.loading = true;

		console.log("submitting tax item ", this.fixedTaxItem.value);

		this.dl
			.doPost("/tax_items/save_fixed?fixed_item=true", {
				...this.fixedTaxItem.value,
				mda_id: this.fixedTaxItem.value.mda_id.id,
			})
			.subscribe(
				(res: any) => {
					this.editMode = false;
					this.loading = false;
					this.toastr.success(
						this.fixedTaxItem.value.title + "  was successfully added",
						"Sucesss"
					);
					this.fixedTaxItem.patchValue({ amount: "", title: "" });
					this.loadTaxItems();
				},
				(error) => {
					this.loading = false;
					console.log("error saving tax item", error);
				}
			);
	}


	validateTaxItemForm(){

		
	}
	addTaxItem(){

		let values:any  = this.taxItemForm.value;

		

	
		let ruleForFixedAmount = "{\"engine\": [\"amount\", \"*\", \"no_of_people\"], \"elements\": [{\"name\": \"amount\", \"label\": \"Amount Stipulated By Law*\", \"value\": \""+values.amount+"\", \"disabled\": \"true\", \"required\": \"true\", \"data_type\": \"number\", \"input_type\": \"input\"}, {\"name\": \"no_of_people\", \"label\": \"Item Count *\", \"value\": \"1\", \"disabled\": \"false\", \"required\": \"true\", \"data_type\": \"number\", \"input_type\": \"input\"}]}";

		let ruleForUnFixedAmount = "{\"engine\": [\"amount\", \"*\", \"no_of_people\"], \"elements\": [{\"name\": \"amount\", \"label\": \"Amount Stipulated By Law*\", \"value\": 0, \"disabled\": \"false\", \"required\": \"true\", \"data_type\": \"number\", \"input_type\": \"input\"}, {\"name\": \"no_of_people\", \"label\": \"Item Count *\", \"value\": \"1\", \"disabled\": \"false\", \"required\": \"true\", \"data_type\": \"number\", \"input_type\": \"input\"}]}";

		let selectMda:any = this.mdas.find((mda)=> mda.slug == values.mda_id);

		let new_tax_item: any = {

			mda_id: selectMda.id,
			rules: values.isFixed=="true"? ruleForFixedAmount:ruleForUnFixedAmount,
			title: values.title,
			mda_slug: selectMda.slug
		}

		this.loading = true;
		console.log(values);
		console.log(new_tax_item);

		this.dl.doPost("/tax_items/save", new_tax_item).subscribe(
			(res: any) => { 
				this.loading = false;
				this.toastr.success("Tax Item Added", "Success!", {
					timeOut: 3000,
				});
				this.modalService.dismissAll("");
			},
			(err) => {
				this.loading = false;
				console.log("error saving tax Item", err);
				this.toastr.error("Error adding item", "Failed!", {
					timeOut: 3000,
				});
			}
		);

	}

	loadTaxItems() {
		this.loading = true;
		this.dl.doGet("/tax_items/list").subscribe(
			(res: any) => {
				const map = res.map((el) =>
					el.rules ? JSON.parse(el.rules) : res.rules
				);
				console.log({ map });
				this.taxItems = res;
				console.log({ items: this.taxItems });
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	inputId;
	inputAmount = 0;

	onNumberChange(e) {
		this.inputAmount = e;
	}

	add(amount, id) {
		this.inputAmount = amount;
		this.inputId = id;
		this.assessments = this.assessments.map((item) =>
			item.id == id ? { ...item, isOpen: true } : item
		);
	}

	loadMdas() {
		this.loading = true;
		this.dl.doGet("/mdas/list").subscribe(
			(res) => {
				console.log("fetched mda ", res);
				this.mdas = res;
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching mda", err);
			}
		);
	}

	deleteInvoice(id, modal) {
		this.loading = true;
		this.modalService
			.open(modal, { ariaLabelledBy: "modal-basic-title", centered: true })
			.result.then(
				(result) => {
					this.dl.doGet("/tax_items/delete/" + id).subscribe((res) => {
						this.loading = false;
						this.toastr.success("Tax Item Deleted!", "Success!", {
							timeOut: 3000,
						});
						this.loadTaxItems();
					});
				},
				(reason) => {
					this.loading = false;
				}
			);
	}

	assessmentForDisplay: any = {};
	displayPayee: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;

	viewAssessment(assessment: any) {
		this.payeeSummary = false;
		this.directAssessmentSummary = false;

		console.log("view assessment ", assessment);

		//if assessment is payee or licence
		if (assessment.tax_item_id == 13) {
			console.log("displaying paye ", assessment.rules);
			/* this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(JSON.parse(assessment.form_items), null);
			console.log("displaying payee ", this.displayPayee);
			this.dynamicSummary = true;
	
			this.displayPayee.push({label:"Billing Ref", value:assessment.billing_ref});
			this.payeeSummary = true;
		
			this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true }); 
			return; */

			try {
				assessment.rules = JSON.parse(assessment.rules);
			} catch (e) {}
			this.dynamicSummary = true;
			this.payeeSummary = true;
			this.assessmentForDisplay = Object.assign({}, assessment);
			this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);

			this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
				this.assessmentForDisplay.form_items,
				assessment.rules
			);

			console.log("rules ", assessment.rules);

			this.assessmentForDisplay.tin = this.userProfile.tin;

			this.modalService.open(this.modalContent, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
			});

			console.log("Display Payee", this.displayPayee);
			return;
		} else if (assessment.rules.length < 3 && assessment.tax_item_id == 14) {
			this.displayPayee =
				this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
					JSON.parse(assessment.form_items)
				);
			console.log("displaying direct assessment ", this.displayPayee);
			this.dynamicSummary = true;
			this.directAssessmentSummary = true;

			this.displayPayee.push({
				label: "Billing Ref",
				value: assessment.billing_ref,
			});

			this.modalService.open(this.modalContent, {
				ariaLabelledBy: "modal-basic-title",
				centered: true,
			});
			return;
		}

		this.dynamicSummary = false;
		this.assessmentForDisplay.billing_ref = assessment.billing_ref;
		this.assessmentForDisplay.id = assessment.id;

		this.assessmentForDisplay.mda = assessment.mda;
		this.assessmentForDisplay.tax_item = assessment.display
			? JSON.parse(assessment.display).tax_item
			: assessment.tax_item;
		this.assessmentForDisplay.tin = assessment.tin;
		this.assessmentForDisplay.amount = assessment.amount;

		this.modalService.open(this.modalContent, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}

	makePaymentForTaxItem(itemId: number) {
		console.log("gotten id ", itemId);

		let item = this.getPaymentItem(itemId);

		console.log("gotten item ", item);
		let amount = 0;

		if (item.mda_id == 3 && item.tax_item_id == 13) {
			amount = item.rules.tax;
		}

		let win: any = window;
		this.pendingItem = item;
		win.payWithPaystack(amount, this);

		console.log("Called paystack");
	}

	pendingItem: any;
	paymentSucceeded() {
		console.log("updating ", this.assessmentForDisplay.id);
		this.loading = true;

		let url: string = "assessment/update_assessment/" + this.pendingItem.id;
		url = url + "/1";
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

	save() {
		this.loading = true;

		setTimeout(() => {
			this.loading = false;
			this.toastr.success("Agent created!", "Success!", {
				timeOut: 10000,
				closeButton: true,
				progressBar: true,
			});
			this.modalService.dismissAll("");
			this.ngOnInit();
		}, 4000);
	}

	getPaymentItem(id: number) {
		console.log("Getting assessment ", id, this.assessments);

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
			this.fixedTaxItem.setValue({
				id: taxItem.id,
				rules: taxItem.rules,
				title: taxItem.title,
				mda_id: taxItem.mda_id,
			});
		} else {
			this.editTitle = "Create TaxItem";
			this.fixedTaxItem.setValue({ title: "", mda_id: "", id: "", rules: "" });
		}

		this.editMode = true;
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}
