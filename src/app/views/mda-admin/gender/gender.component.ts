import { Component, OnInit, ViewChild } from '@angular/core';
import { echartStyles } from 'src/app/shared/echart-styles';
import { ProductService } from 'src/app/shared/services/product.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { AssessmentService } from 'src/app/shared/services/assessment.service';
import { Utils } from 'src/app/shared/utils';

import { ActivatedRoute } from '@angular/router';


import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';


@Component({
	selector: 'app-dashboard-v2',
	templateUrl: './gender.component.html',
	styleUrls: ['./gender.component.scss'],
	animations: [SharedAnimations]
})
export class GenderComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	taxItems: any;

	agents: any[] = [

		{ name: "Male", id: 102348 },

		{ name: "Female", id: 102348 },

		{ name: "Trans", id: 102348 },

		{ name: "Other", id: 102348 }

	];


	@ViewChild('modalConfirm', { static: false }) private modalContent;

	@ViewChild('modalCreate', { static: false }) private addModal;


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
	) { }

	ngOnInit() {


		console.log("testing utils", Utils.getTimeIntervalPhpTimeStamp((Date.now() / 1000)));

		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem('setupGender');

		this.route.params.forEach((e: any) => {

			if (e.status) this.status = e.status;
		})



		this.loading = true;

		setTimeout(() => {

			this.loading = false;
		}, 4000);


		this.route.params.subscribe(params => {
			this.status = params['status'];
			this.loadAssessments(); // reset and set based on new parameter this time
		});

		console.log("param is ", this.status)


		//this.loadTaxItems();
		//this.loadMdas() 

		this.taxItemForm = this.fb.group({
			id: [''],
			title: ['', Validators.required],
			mda_id: ['', Validators.required],
			rules: ['']
		});

	}

	timeAgo(timestamp: number) {

		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}

	submitTaxItem() {

		if (this.taxItemForm.value.mda_id == null || parseInt(this.taxItemForm.value.mda_id) < 1) {
			return;
		}

		this.loading = true;

		console.log("submitting tax item ", this.taxItemForm.value);

		this.dl.doPost("/tax_items/save", this.taxItemForm.value).subscribe((res) => {
			console.log("result saving", res);
			this.editMode = false;
			this.loading = false;
			this.loadTaxItems();
		}, error => {
			this.loading = false;
			console.log("error saving tax item", error);
		})

	}

	loadTaxItems() {
		this.loading = true;
		this.dl.doGet("/tax_items/list")
			.subscribe(res => {
				console.log("fetched taxitems ", res);
				this.taxItems = res;
				this.loading = false;
			},
				(err => {
					this.loading = false;
					console.log("error fetching tax items", err)
				}));
	}


	print() {

		window.print();
	}


	add() {

		this.modalService.open(this.addModal, { ariaLabelledBy: 'modal-basic-title', centered: true })

	}

	loadAssessments() {
		this.loading = true;

		let url = "/payments/get_payment_history/" + this.userProfile.Id;

		if (this.status != undefined) {
			url = url + "/" + this.status;
		}

		this.dl.doGet(url)
			.subscribe(res => {
				console.log("fetched assessments ", res);
				this.assessments = res;
				this.loading = false;
			},
				(err => {
					this.loading = false;
					console.log("error fetching tax items", err)
				}));
	}

	loadMdas() {
		this.loading = true;
		this.dl.doGet("/mdas/list")
			.subscribe(res => {
				console.log("fetched mda ", res);
				this.mdas = res;
				this.loading = false;
			},
				(err => {
					this.loading = false;
					console.log("error fetching mda", err)
				}));
	}

	deleteInvoice(id, modal) {
		this.loading = true;
		this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
			.result.then((result) => {
				this.dl.doGet("/tax_items/delete/" + id)
					.subscribe(res => {
						this.loading = false;
						this.toastr.success('Tax Item Deleted!', 'Success!', { timeOut: 3000 });
						this.loadTaxItems();
					})
			}, (reason) => {
				this.loading = false;
			});
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
			}
			catch (e) {

			}
			this.dynamicSummary = true;
			this.payeeSummary = true;
			this.assessmentForDisplay = Object.assign({}, assessment);
			this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);

			this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(this.assessmentForDisplay.form_items, (assessment.rules));

			console.log("rules ", assessment.rules);

			this.assessmentForDisplay.tin = this.userProfile.tin;


			this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });

			console.log("Display Payee", this.displayPayee);
			return;

		}
		else if (assessment.rules.length < 3 && assessment.tax_item_id == 14) {

			this.displayPayee = this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(JSON.parse(assessment.form_items));
			console.log("displaying direct assessment ", this.displayPayee);
			this.dynamicSummary = true;
			this.directAssessmentSummary = true;

			this.displayPayee.push({ label: "Billing Ref", value: assessment.billing_ref });


			this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
			return;
		}



		this.dynamicSummary = false;
		this.assessmentForDisplay.billing_ref = assessment.billing_ref;
		this.assessmentForDisplay.id = assessment.id;

		this.assessmentForDisplay.mda = assessment.mda;
		this.assessmentForDisplay.tax_item = assessment.display ? JSON.parse(assessment.display).tax_item : assessment.tax_item;
		this.assessmentForDisplay.tin = assessment.tin;
		this.assessmentForDisplay.amount = assessment.amount;



		this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });

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
		this.dl.doGet(url).subscribe((res) => {

			this.loading = false;
			this.toastr.success("Success", "Payment Successful!", { timeOut: 10000, closeButton: true, progressBar: true });
			this.modalService.dismissAll("dismiss");

		},
			err => {

				this.loading = false;
				this.toastr.error("Failed!", "Payment Failed", { timeOut: 10000, closeButton: true, progressBar: true });
				this.modalService.dismissAll("dismiss");
			}
		);

	}

	save() {

		this.loading = true;

		setTimeout(() => {
			this.loading = false;
			this.toastr.success("Agent created!", "Success!", { timeOut: 10000, closeButton: true, progressBar: true });
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
			this.taxItemForm.setValue({ id: taxItem.id, rules: taxItem.rules, title: taxItem.title, mda_id: taxItem.mda_id });
		}
		else {
			this.editTitle = "Create TaxItem";
			this.taxItemForm.setValue({ title: '', mda_id: '', id: '', rules: '' });
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
