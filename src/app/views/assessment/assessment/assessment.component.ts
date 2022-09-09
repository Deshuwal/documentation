import {
	Component,
	ElementRef,
	Input,
	OnInit,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	Validators,
	ValidationErrors,
	NgModel,
} from "@angular/forms";
import {
	DirectAssment,
	PayeeCalculator,
} from "src/app/shared/models/payee_calculator";

import {
	concat,
	forkJoin,
	merge,
	Observable,
	of,
	Subject,
	throwError,
} from "rxjs";

import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	switchMap,
	tap,
	map,
	filter,
} from "rxjs/operators";
import jsPDF from "jspdf";
import { Utils } from "src/app/shared/utils";
import { ProductService } from "src/app/shared/services/product.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { HttpService } from "src/app/shared/services/http.service";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import html2canvas from "html2canvas";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./assessment.component.html",
	styleUrls: ["./assessment.component.scss"],
	animations: [SharedAnimations],
})
export class AssessmentComponent implements OnInit {
	public mdas: any = [];

	private currentTin: any;

	public taxItems: any = [];

	@ViewChild("modalConfirm", { static: false }) private modalContent;

	@ViewChild("acceptTerms", { static: true }) private acceptTermsModal;

	selectedTIN: any = null;

	config = {
		displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 50,
		moreText: "More",
		searchPlaceholder: "Search by TIN.",
		noResultsFound: "No results found!",
		searchOnKey: "tin",
	};

	private psirsTaxItemFilter: Record<string, number[]> = {
		company: [3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 17, 18, 19, 20, 4568],
		individual: [3, 4, 5, 6, 7, 8, 9, 14, 15, 17, 18, 19, 20, 4568],
	};

	dateIssued: string =
		new Date().getDate() +
		"-" +
		new Date().getMonth() +
		1 +
		"-" +
		new Date().getFullYear();

	assessmentForm: FormGroup;
	directAssessmentForm: FormGroup;
	directAssessmentPresumptiveForm: FormGroup;

	public loading: boolean = false;
	public selectedMda: any;
	public selectedItemAnswers: any = [];
	public userProfile: any;
	public direct_assessment_form: boolean;
	public direct_assessment_form_presumtive: boolean;
	public dynamicSummary: boolean = false;
	public nonAutomatedAssessment: boolean = false;
	public payeeLabels: any = [
		{ label: "Statutory Total", value: "0" },
		{ label: "Net Adjustments", value: "0" },
		{ label: "Total Relief", value: "0" },
		{ label: "Withholding Tax", value: "0" },
		{ label: "Deductions", value: "0" },
		{ label: "Total Income", value: "0" },
		{ label: "Chargeable Income", value: "0" },
		{ label: "Net Payable", value: "0" },
		{ label: "Total Assessable", value: "0" },
		{ label: "Consolidated Relief", value: "0" },
		{ label: "Text Charged", value: "0" },
		{ label: "Tax Due", value: "0" },
	];

	id: string;
	public payeeForm: FormGroup;

	public revenue_return_assessment: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private localStore: LocalStoreService,
		private printPDF: PrintpdfService,
		private dl: HttpService,
		private assessmentService: AssessmentService,
		private toastService: ToastrService,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private breadcrumb: BreadcrumbService
	) { }

	@Input() gross_income: string;

	exportAsPDF(div_id) {
		this.printPDF.downloadAssessment(div_id, "tax-assessment.pdf");
	}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");

		this.assessmentForm = this.fb.group({
			mda_id: [""],
			tax_item_id: [""],
			mda_slug: [""],
			tin_slug: [""],
			amount: [""],
			description: [""],
			rules: [""],
		});

		this.assessmentForm.get("tin_slug").valueChanges.subscribe((e) => {
			if (e && e.tin) {
				const isCompany =
					e.tin != (this.userProfile.tin || this.userProfile.stin);
				let psirsFilter = isCompany
					? this.psirsTaxItemFilter["company"]
					: this.psirsTaxItemFilter["individual"];
				let res = [...this.clonesTaxItems];
				this.taxItems = res.filter((taxItem) =>
					parseInt(taxItem.mda_id) === 3
						? psirsFilter.includes(parseInt(taxItem.id))
						: true
				);
			}
		});

		this.payeeForm = this.fb.group({
			income_basic_salary: ["", Validators.required],
			income_transport: ["", Validators.required],
			income_others: [],
			income_housing: ["", Validators.required],
			period_from: ["", Validators.required],
			period_to: ["", Validators.required],
			deduction_pension: [],
			deduction_nhf: [],
			deduction_nhis: [],
			deduction_life_premium: [],
			deduction_voluntary_contribution: [],
			deduction_voluntary_contribution_percentage: [],
			dev_levy: [""],
		});

		this.payeeForm.patchValue({
			income_basic_salary: 0,
			income_transport: 0,
			income_housing: 0,
		});

		this.directAssessmentForm = this.fb.group({
			vocation: [],
			year: ["", Validators.required],
			gross: ["", Validators.required],
			taxable_income: [],
			tax_payable: [],
			cra: [],
			dev_levy: [],
		});

		this.directAssessmentForm.valueChanges.subscribe((data) => {
			const taxCalculator = new PayeeCalculator();
			const directAss: DirectAssment = taxCalculator.CalculateDirectAssessment(
				data.gross
			);
			this.directAssessmentForm.patchValue(
				{
					taxable_income: directAss.ti,
					tax_payable: directAss.tax,
					cra: directAss.cra,
				},
				{ emitEvent: false }
			);
		});

		this.directAssessmentPresumptiveForm = this.fb.group({
			trade: ["", Validators.required],
			amount: ["", Validators.required],
			bvn: [""],
		});

		this.breadcrumb.setCrumbItem("performAssessment");

		this.loading = true;
		this.loadUsersTin();
		this.loadMdas().then((res) => {
			this.loading = false;
			this.initializePage();
		});
		this.loadTins();

		/*if(!this.userProfile.mda_id) {
			this.getMdaForAssessment().then((res) => {
				this.loading = false;
				this.loadTaxItems();
			});
		} */

		this.route.queryParams.subscribe((params) => {
			if (params.view) {
				this.localStore.setItem("assessmentToView", params.view);
				window.location.href = window.location.href.split("?")[0];
				window.location.reload();
				return;
			}

			if (params.terms) {
				this.localStore.setItem("showTerms", true);
				window.location.href = window.location.href.split("?")[0];
				window.location.reload();
				return;
			}
		});
	}



	initializePage() {
		this.route.params.forEach((e: any) => {
			if (e.page) {
				switch (e.page) {
					case "paye":
						this.assessmentForm.patchValue({ mda_id: 3, tax_item_id: 13 });
						this.loadTaxItems();
						break;
				}
			}
		});

		const showTerms = this.localStore.getItem("showTerms") || false;
		const assessmentId = this.localStore.getItem("assessmentToView");

		if (assessmentId) {
			this.viewAssessment(assessmentId);
			return;
		}
		// if(showTerms) {
		this.loadTermsOfUse();
		// }

	}
	isMdaAdminUser: boolean = false;

	getMdaForAssessment() {
		let url = this.parseUrl('mdas/find_by_id');
		let app = this;

		return new Promise((resolve, reject) => {
			app.dl.doGet(url).subscribe(
				(res: any) => {
					console.log("fetched mda ", res);
					app.mdas = res;

					console.log('Viva MDA', res)
					app.selectedMda = res;
					app.selectedMdaData = res;
					app.mdas = res;
					app.isMdaAdminUser = true;

					// app.assessmentForm.patchValue({
					// 	mda_slug: res.slug,
					// });
					app.loading = false;
					resolve(res);
				},
				(err) => {
					app.loading = false;
					reject(err);
				}
			);
		});
	}

	setDefaultUserMda() {
		this.getAnMDA(this.userProfile.mda_id);
		this.isMdaAdminUser = true;
		// this.loadTaxItems();
	}

	getAnMDA(id) {
		const result = this.mdas.filter(mda => mda.id == id);
		this.selectedMda = result[0];
	}

	viewAssessment(id) {
		this.loading = true;
		this.dl.doGet(`/assessment/${id}`).subscribe(
			(response: any) => {
				const display = response.display ? JSON.parse(response.display) : null;
				this.dynamicSummary = false;
				this.nonAutomatedAssessment = false;
				this.assessmentForDisplay = Object.assign(
					{},
					{ ...response, ...display }
				);
				this.openConfirmModal();
				this.localStore.setItem("assessmentToView", null);
			},
			(err) => {
				this.loading = false;
				this.toastService.error(
					"We could not load assessment result. Please reload page.",
					"Loading Failed!"
				);
			},
			() => {
				this.loading = false;
			}
		);
	}

	loadTermsOfUse() {
		this.modalService.open(this.acceptTermsModal);
	}

	acceptTermsOfUse() {
		this.modalService.dismissAll();
		this.localStore.setItem("showTerms", null);
	}

	printPDFS(div) {
		this.printPDF.printPdf(div);
	}

	submitDirectAssessmentPresumptive() {
		if (this.directAssessmentPresumptiveForm.invalid) {
			this.getFormValidationErrors(this.directAssessmentPresumptiveForm);

			this.toastService.error(
				"Fields marked with asterisk are required",
				"Error",
				{ timeOut: 10000, closeButton: true, progressBar: true }
			);
			return;
		}

		let assessment: any = {
			tax_item_id: this.selectedItem.slug,
			user_id: this.userProfile.id,
			created_by: `${this.userProfile.first_name} ${this.userProfile.other_names || ""} ${this.userProfile.surname}`,
			form_items: [],
			rules: [],
		};

		for (var key in this.directAssessmentPresumptiveForm.value) {
			if (this.directAssessmentPresumptiveForm.value[key]) {
				assessment.form_items.push({
					label: key,
					value: this.directAssessmentPresumptiveForm.value[key],
				});
			} else {
			}
		}

		this.saveAssessment(assessment, -1, "direct_assessment_presumptive");
	}

	submitDirectAssessment() {
		if (this.directAssessmentForm.value.gross < 1) {
			this.toastService.error(
				"Your gross income must be a value greater than zero (0)",
				"Error",
				{
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				}
			);
			return;
		}
		if (this.directAssessmentForm.invalid) {
			this.getFormValidationErrors(this.directAssessmentForm);
			this.toastService.error(
				"Fields marked with asterisk are required",
				"Error",
				{ timeOut: 10000, closeButton: true, progressBar: true }
			);
			return;
		}

		let assessment: any = {
			// mda_slug: this.assessmentForm.value.mda_slug,
			tax_item_id: this.selectedItem.slug,
			user_id: this.userProfile.id,
			created_by:`${this.userProfile.first_name} ${this.userProfile.other_names || ""} ${this.userProfile.surname}`,
			form_items: [],
			rules: [],
		};

		for (var key in this.directAssessmentForm.value) {
			if (this.directAssessmentForm.value[key]) {
				assessment.form_items.push({
					label: key,
					value: this.directAssessmentForm.value[key],
				});
			} else {
			}
		}
		assessment.tax_item_id = this.selectedItem.id;

		this.saveAssessment(assessment, -1, "direct_assessment");
	}

	loadTaxRules() {
		console.log("loading rules ", this.assessmentForm.value);
	}

	goToPayment() {
		this.modalService.dismissAll();
		this.router.navigateByUrl(
			`payment/all?billing_ref=${this.assessmentForDisplay.billing_ref}`
		);
	}

	getSelectedMda() {
		let slug = this.assessmentForm.value.mda_slug;
		for (let i = 0; i < this.mdas.length; i++) {
			if (this.mdas[i].slug == slug) return this.mdas[i];
		}
		return null;
	}

	getSelectedItem() {
		let id = this.assessmentForm.value.tax_item_id;
		for (let i = 0; i < this.taxItems.length; i++) {
			if (this.taxItems[i].id == id) return this.taxItems[i];
		}
		return null;
	}

	clonesTaxItems = [];
	selectedMdaData: any;

	loadTaxItems() {
		this.loading = true;
		let app = this;
		this.payee_form = false;
		this.fixed_assessment = false;
		this.revenue_return_assessment = false;
		if (!this.userProfile.mda_id) {
			this.selectedMda = this.getSelectedMda();
		}

		// this.taxItems = [];
		this.selectedItem = null;
		app.nonAutomatedAssessment = false;
		let taxitemsUrl = `/tax_items/list_for_mda`;
		if (this.getSelectedMda()) {
			this.selectedMda = this.getSelectedMda()
			taxitemsUrl = taxitemsUrl + "/" + this.selectedMda.id;
		}
		console.log({ taxitemsUrl });

		return new Promise((resolve, reject) => {
			app.dl.doGet(taxitemsUrl).subscribe(
				(response: any[]) => {
					this.clonesTaxItems = response;
					console.log('TAZ ITEMS', response);

					let res = [...response];

					if (this.assessmentForm.value.tin_slug) {
						if (this.userProfile.role == "1") {
							const matches =
								this.assessmentForm.value.tin_slug.match(/\((.*?)\)/);

							const isCompany = this.foundTins.find(
								(el) => el.tin == matches[1]
							).business_industry;

							const psirsFilter = isCompany
								? this.psirsTaxItemFilter["company"]
								: this.psirsTaxItemFilter["individual"];

							app.taxItems = res;
							res = res.filter((taxItem) =>
								parseInt(taxItem.mda_id) === 3
									? psirsFilter.includes(parseInt(taxItem.id))
									: true
							);

							console.log("if tin slug", app.taxItems);
						} else {
							const matchedTin = this.assessmentForm.value.tin_slug.tin;
							const isCompany =
								matchedTin != (this.userProfile.tin || this.userProfile.stin);
							const psirsFilter = isCompany
								? this.psirsTaxItemFilter["company"]
								: this.psirsTaxItemFilter["individual"];

							res = res.filter((taxItem) =>
								parseInt(taxItem.mda_id) === 3
									? psirsFilter.includes(parseInt(taxItem.id))
									: true
							);


						}
					}

					
					//Push Row with others to the last.
					const indexOfObject = response.findIndex((object) => {
						return object.title === "Others";
					});
					
					if (indexOfObject !== -1) {
						response.push(response.splice(indexOfObject, 1)[0]);
					}
					//
					app.taxItems = response;

					console.log("tax items is now ", app.taxItems);

					if (res.length < 1) {
						app.nonAutomatedAssessment = true;
						this.selectedItem = null;
						this.displayAutomaticAssessmentNotFoundMessage();
					}
					app.loading = false;

					this.moveToScreenBottom();
					resolve(res);
				},
				(err) => {
					app.loading = false;
					// console.log("error fetching tax items", err);
					resolve(err);
				}
			);
		});
	}

	directPresumptiveTotal = 0;

	assessmentForDisplay: any = {
		id: "",
		mda: "",
		tax_item: "",
		tin: "",
		amount: "",
		billing_ref: "",
		payer_name: "",
		created_by: "",
	};
	displayPayee: any;
	displayDirectAssessment: any;
	payeeSummary: boolean;
	directAssessmentSummary: boolean;
	directAssessmentPresumptiveSummary: boolean;

	moveToScreenBottom() {
		setTimeout(() => {
			let win: any = window;
			win.scrollTo(0, document.body.scrollHeight);
		}, 500);
	}

	saveAssessment(
		assessment: any,
		assessmentResult: any,
		assessmentType: string = "auto",
		pc: PayeeCalculator = null
	) {
		console.log("saving assessment ", assessment);

		this.loading = true;
		let app = this;
		assessment.rules =
			pc == null ? JSON.stringify(assessment.rules) : JSON.stringify(pc);
		assessment.form_items = JSON.stringify(assessment.form_items);
		assessment.amount =
			this.nonAutomatedAssessment == true
				? this.assessmentForm.get("amount").value
				: assessmentResult;
		assessmentType =
			this.nonAutomatedAssessment == true ? "nonAuto" : assessmentType;

		if (assessmentType == "auto") {
			console.log("auto", assessment);
			this.assessmentForDisplay.mda = this.getSelectedMda().title;
			this.assessmentForDisplay.tax_item =
				this.getSelectedItem().title || assessment.tax_item;
			this.assessmentForDisplay.tin = this.assessmentForm.value.tin_slug.tin;

			this.assessmentForDisplay.amount = assessmentResult;
		} else if (assessmentType == "nonAuto") {
			let parsedDescription = JSON.parse(assessment.rules);
			const result = this.getSelectedMda();
			this.assessmentForDisplay.mda = result.title;
			this.assessmentForDisplay.tin = app.userProfile.tin;
			this.assessmentForDisplay.tax_item =
				this.selectedItem && this.selectedItem.tax_item;
			this.assessmentForDisplay.amount = assessment.amount;
			this.assessmentForDisplay.description = parsedDescription.description;
		} else if (assessmentType == "paye") {
			this.dynamicSummary = true;
			console.log("saving paye assessment ", assessment);
			this.payeeSummary = true;
			this.assessmentForDisplay = Object.assign({}, assessment);
			this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);
			this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
				this.assessmentForDisplay,
				pc
			);
		} else if (assessmentType == "direct_assessment") {
			assessment.mda_id = "3";
			this.dynamicSummary = true;
			this.directAssessmentSummary = true;

			this.assessmentForDisplay = Object.assign({}, assessment);
			this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);
			this.assessmentForDisplay.mda = this.getSelectedMda().title;
			this.assessmentForDisplay.description = this.getSelectedItem().title;
			this.displayPayee =
				this.assessmentService.arrangeDirectAssessmentHighNetWorthFormDataForDisplay(
					this.assessmentForDisplay.form_items
				);
			console.log(
				"here -----------hshshsh",
				this.assessmentForDisplay.form_items
			);
		} else if (assessmentType == "direct_assessment_presumptive") {
			this.dynamicSummary = true;
			this.assessmentForDisplay = Object.assign({}, assessment);
			this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);
			this.displayPayee =
				this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
					this.assessmentForDisplay.form_items
				);

			const amount = 1 * this.directAssessmentPresumptiveForm.value["amount"];

			assessment.amount = amount;
			this.directPresumptiveTotal = amount;
			this.directAssessmentPresumptiveSummary = true;
			assessment.mda_id = "3";
			assessment.tax_item_id = "4565";
			// console.log("direct_assessment_presumptive");
		}

		if (this.userProfile.role == "0") {
			this.assessmentForDisplay.tin_owner = this.tins.find(
				(el) => el.tin == this.assessmentForm.value.tin_slug.tin
			).company_name;
		}

		assessment.payer_tin = this.assessmentForm.value.tin_slug.tin;
		assessment.payer_name = this.assessmentForDisplay.tin_owner;

		if (["1", "3"].includes(this.userProfile.role)) {
			let tinOwnerObj = this.foundTins.find(
				(el) =>
					el.name == this.assessmentForm.value.tin_slug ||
					this.assessmentForm.value.tin_slug.indexOf(el.tin) > -1
			);

			if (tinOwnerObj) {
				const payer_name = `${tinOwnerObj.first_name} ${tinOwnerObj.other_names || ""} ${tinOwnerObj.surname}`;
				this.assessmentForDisplay.tin_owner = payer_name;
				assessment.payer_name = payer_name;
				this.assessmentForDisplay.payer_tin = tinOwnerObj.tin;
				assessment.payer_tin = tinOwnerObj.tin;
			}
		}

		// // console.log("saving assessment ", JSON.stringify(assessment));
		this.dl.doPost("assessment/save", assessment).subscribe(
			(res: any) => {
				// console.log("result saving assessment ", res);
				this.loading = false;
				if (res.status && res.status == true) {
					this.assessmentForDisplay.tin = res.data.tin;
					this.assessmentForDisplay.billing_ref = res.data.billing_ref;
					this.assessmentForDisplay.payer_tin = res.data.payer_tin;
					this.assessmentForDisplay.payer_name = res.data.payer_name;
					this.assessmentForDisplay.id = res.data.id;
					this.assessmentForDisplay.name = res.data.name;
					this.assessmentForDisplay.created_by = res.data.created_by;
					// (this.assessmentForDisplay.dev_evy = JSON.parse(
					//   assessment.rules.assessment.dev_levy
					// )),
					this.nonAutomatedAssessment = false;
					this.openConfirmModal();
				} else {
					return this.toastService.error(res.reason, "An Error occurred!");
				}
			},
			(err) => {
				console.log("save result error", err);
				this.loading = false;
				this.toastService.error("Error", err.error, {
					timeOut: 5000,
					closeButton: true,
					progressBar: true,
				});
			}
		);
	}

	updateAssessment(status: number) {
		// console.log("updating ", this.assessmentForDisplay.id);
		this.loading = true;
		this.dl
			.doGet(
				"assessment/update_assessment/" +
				this.assessmentForDisplay.id +
				"/" +
				status
			)
			.subscribe(
				(res) => {
					this.loading = false;
					this.toastService.success("Success", "Assessment Status Updated!", {
						timeOut: 5000,
						closeButton: true,
						progressBar: true,
					});
					this.modalService.dismissAll("dismisse");
					this.router.navigateByUrl("/taxpayer/assessment/history/" + status);
				},
				(err) => {
					this.loading;
				}
			);
	}

	closeModal() {
		this.modalService.dismissAll("dismssis");
		window.location.reload();
	}

	getFormValidationErrors(form: FormGroup) {
		Object.keys(form.controls).forEach((key) => {
			const controlErrors: ValidationErrors = form.get(key).errors;
			if (controlErrors != null) {
				Object.keys(controlErrors).forEach((keyError) => {
					// console.log(
					//   "Key control: " + key + ", keyError: " + keyError + ", err value: ",
					//   controlErrors[keyError]
					// );
				});
			}
		});
	}

	modal: NgbModal;
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

	selectedItem: any;
	public fixed_assessment: boolean = false;
	payee_form: boolean = false;

	submitPayee() {
		if (
			this.payeeForm.value.income_basic_salary +
			this.payeeForm.value.income_transport +
			this.payeeForm.value.income_housing <
			1
		) {
			return this.toastService.error(
				"There is no Gross Income! Please your income and try again",
				"Error",
				{
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				}
			);
		}

		if (this.payeeForm.invalid) {
			this.getFormValidationErrors(this.payeeForm);
			this.toastService.error(
				"Fields marked with asterisk are required",
				"Error",
				{ timeOut: 10000, closeButton: true, progressBar: true }
			);
			return;
		}

		let pC = new PayeeCalculator();
		pC.CalculatePayee(this.payeeForm.value);

		let assessment: any = {
			mda_id: this.selectedItem.mda_id,
			tax_item_id: this.selectedItem.id,
			user_id: this.userProfile.id,
			created_by:`${this.userProfile.first_name} ${this.userProfile.other_names || ""} ${this.userProfile.surname}`,
			form_items: [],
			rules: [],
			period_from: this.payeeForm.value.period_from,
			period_to: this.payeeForm.value.period_to,
		};

		console.log("Paye assessment is ", assessment);

		for (var key in this.payeeForm.value) {
			if (this.payeeForm.value[key]) {
				assessment.form_items.push({
					label: key,
					value: this.payeeForm.value[key],
				});
			} else {
			}
		}

		// console.log("submit payee ");
		// console.log({ assessment }, "PCCC: ", pC);
		this.saveAssessment(assessment, -1, "paye", pC);
	}
	showOthers = false;
	displayItemRules() {
		this.fixed_assessment = false;
		this.payee_form = false;
		this.direct_assessment_form = false;
		this.direct_assessment_form_presumtive = false;
		this.directAssessmentSummary = false;
		this.directAssessmentPresumptiveSummary = false;

		this.payeeSummary = false;
		this.selectedItem = null;

		this.revenue_return_assessment = false;

		let selectedItem = this.getSelectedItem();

		if (selectedItem == null) {
			selectedItem = { id: -1 };
		}

		this.moveToScreenBottom();
		if (selectedItem.id == 15) {
			const payer_tin = this.currentTin
				? this.currentTin.tin
				: this.assessmentForm.value.tin_slug.tin;
			const payer_name = this.currentTin
				? this.currentTin.payer_name
				: this.assessmentForm.value.tin_slug.company_name;
			this.router.navigateByUrl(
				`/assessment/presumptive-tax?payer_tin=${payer_tin}&payer_name=${payer_name}`
			);
			console.log({
				url: `/assessment/presumptive-tax?payer_tin=${payer_tin}&payer_name=${payer_name}`,
			});
			return;
		}

		if (selectedItem.id == 16) {
			this.router.navigateByUrl("/assessment/road-tax");
			return;
		}

		if (selectedItem.id == 17) {
			const payer_tin = this.currentTin
				? this.currentTin.tin
				: this.assessmentForm.value.tin_slug.tin;
			const payer_name = this.currentTin
				? this.currentTin.payer_name
				: this.assessmentForm.value.tin_slug.company_name;
			this.router.navigateByUrl(
				`/assessment/consumption-tax?payer_tin=${payer_tin}&payer_name=${payer_name}`
			);
			return;
		}

		if (selectedItem.id == 18) {
			const payer_tin = this.currentTin
				? this.currentTin.tin
				: this.assessmentForm.value.tin_slug.tin;
			const payer_name = this.currentTin
				? this.currentTin.payer_name
				: this.assessmentForm.value.tin_slug.company_name;
			this.router.navigateByUrl(
				`/assessment/entertainment-tax?payer_tin=${payer_tin}&payer_name=${payer_name}`
			);
			return;
		}

		if (selectedItem.id == 19) {
			const payer_tin = this.currentTin
				? this.currentTin.tin
				: this.assessmentForm.value.tin_slug.tin;
			const payer_name = this.currentTin
				? this.currentTin.payer_name
				: this.assessmentForm.value.tin_slug.company_name;
			this.router.navigateByUrl(
				`/revenue-returns/individual?payer_tin=${payer_tin}&mda_id=3&payer_name=${payer_name}`
			);
			return;
		}
		if (selectedItem.id == 20 && selectedItem.mda_id == 3) {
			const payer_tin = this.currentTin
				? this.currentTin.tin
				: this.assessmentForm.value.tin_slug.tin;
			const payer_name = this.currentTin
				? this.currentTin.payer_name
				: this.assessmentForm.value.tin_slug.company_name;
			this.router.navigateByUrl(
				`/revenue-returns/corporate?payer_tin=${payer_tin}&payer_name=${payer_name}&mda_id=3`
			);
			return;
		}

		//if a fixed rule like payee or vehicle...stop here
		if (
			(!selectedItem.rules || selectedItem.rules.length < 4) &&
			selectedItem.id == 13
		) {
			// console.log("empty rules paye");
			this.fixed_assessment = true;
			this.payee_form = true;
			this.selectedItem = selectedItem;
			return;
		}

		if (
			(!selectedItem.rules || selectedItem.rules.length < 4) &&
			selectedItem.id == 14
		) {
			// console.log("empty rules direct assessment");
			this.fixed_assessment = true;
			this.direct_assessment_form = true;
			this.selectedItem = selectedItem;
			return;
		}

		if (
			(!selectedItem.rules || selectedItem.rules.length < 4) &&
			selectedItem.id == 4565
		) {
			// console.log("empty rules direct assessment");
			this.fixed_assessment = true;
			this.direct_assessment_form_presumtive = true;
			this.selectedItem = selectedItem;
			return;
		}

		if (!selectedItem.rules || selectedItem.rules.length < 4 || selectedItem.id == -1) {
			console.log("selected item ", selectedItem.rules);
			this.displayAutomaticAssessmentNotFoundMessage();
			this.nonAutomatedAssessment = true;
			this.showOthers = true;
			this.selectedItem = selectedItem;
			return;
		} else {
			this.nonAutomatedAssessment = false;
			this.loading = false;
		}

		// console.log("selected assessment ", selectedItem);
		selectedItem.rules = JSON.parse(selectedItem.rules);
		let i = 0;

		selectedItem.rules.elements.forEach((item: any) => {
			this.selectedItemAnswers[i] = selectedItem.rules.elements[i].value;
			i++;
		});
		this.selectedItem = selectedItem;
		// console.log("selectedIems ", this.selectedItem);
	}

	displayAutomaticAssessmentNotFoundMessage() {
		this.toastService.info(
			"No Automatic Assessment for this Item",
			"Enter amount and item being paid for"
		);
	}

	loadingTins = false;
	tins: any = [];

	loadUsersTin() {
		this.loadingTins = true;
		this.dl.doGet("users/user_related_tins").subscribe(
			(res: any) => {
				this.tins = [
					...res.data,
					{
						tin: this.userProfile.tin,
						company_name:
							this.userProfile.name && this.userProfile.name.trim()
								? this.userProfile.name.trim()
								: `${this.userProfile.first_name} ${this.userProfile.other_names} ${this.userProfile.surname}`,
					},
				];
				this.loadingTins = false;
			},
			(err) => {
				this.loadingTins = false;
			}
		);
	}

	loadMdas() {
		let app = this;
		this.loading = true;
		return new Promise((resolve, reject) => {
			app.dl.doGet("mdas/list").subscribe(
				(res) => {
					console.log("fetched mda ", res);
					app.mdas = res;
					app.loading = false;
					resolve(res);
				},
				(err) => {
					app.loading = false;
					reject(err);
				}
			);
		});
	}

	submitAssessment() {
		// console.log("submitAssessment");

		//fill the values of the selectItemanswer elements manually
		//for some reason; i couldnt attach it directly to ngModel on time
		for (let i = 0; i < this.selectedItem.rules.elements.length; i++) {
			this.selectedItem.rules.elements[i].value = this.selectedItemAnswers[i];
		}

		// console.log(this.selectedItem);

		let valid: boolean = this.validateCustomForm(
			this.selectedItem.rules.elements
		);

		if (valid) {
			let result = this.assessmentService.doAssessment(this.selectedItem.rules);

			let assessment: any = {
				mda_id: this.selectedItem.mda_id,
				tax_item_id: this.selectedItem.id,
				user_id: this.userProfile.id,
				created_by:`${this.userProfile.first_name} ${this.userProfile.other_names || ""} ${this.userProfile.surname}`,
				rules: this.selectedItem.rules,
			};

			console.log("assessment is ", assessment);
			this.saveAssessment(assessment, result);
		} else {
			this.showError(
				"Please fill all fields",
				"Inputs marked with asterisk are compulsory"
			);
		}
	}

	onDropdownClick(item) {
		if (this.assessmentForm.value.tin_slug) {
			const matches = this.assessmentForm.value.tin_slug.match(/\((.*?)\)/);
			const matched = this.foundTins.find((el) => el.tin == matches[1])
			this.currentTin = matched;
			const isCompany = !!matched.business_industry || false;
			const psirsFilter = isCompany
				? this.psirsTaxItemFilter["company"]
				: this.psirsTaxItemFilter["individual"];

			this.taxItems = this.clonesTaxItems;

			this.taxItems.filter((taxItem) =>
				parseInt(taxItem.mda_id) === 3
					? psirsFilter.includes(parseInt(taxItem.id))
					: true
			);
		}
	}

	foundTIN$: Observable<any>;
	companiesLoading = false;
	companiesInput$ = new Subject<string>();
	minLengthTerm = 3;
	foundTins = [];

	loadTins() {
		this.foundTIN$ = concat(
			of([]), // default items
			this.companiesInput$.pipe(
				filter((res) => {
					return res !== null && res.length >= this.minLengthTerm;
				}),
				distinctUntilChanged(),
				debounceTime(1000),
				tap(() => (this.companiesLoading = true)),
				switchMap((term) => {
					return this.getCompanies(term).pipe(
						map(({ data }) => {
							const response = data.map((data: any) => {
								if (data.first_name && data.surname) {
									return {
										...data,
										payer_name: `${data.first_name} ${data.other_names || ""
											}  ${data.surname}`,
										name: `${data.first_name} ${data.other_names || ""} ${data.surname
											} (${data.tin})`,
									};
								} else {
									return {
										...data,
										payer_name: `${data.first_name} ${data.other_names || ""
									}  ${data.surname}`,
										name: `${data.first_name} ${data.other_names || ""
									}  ${data.surname} (${data.tin})`,
									};
								}
							});

							this.foundTins = response;
							return response;
						}),
						catchError(() => of([])), // empty list on error
						tap(() => (this.companiesLoading = false))
					);
				})
			)
		);
	}

	getCompanies(term: string = null): Observable<any> {
		return this.dl.doGet("/users/search_tins?tin=" + term);
	}

	submitNonAutomatedAssessment() {
		let selectedMDA = this.getSelectedMda();
		let result;
		let assessment: any = {
			mda_id: selectedMDA.id,
			tax_item_id:
				this.selectedItem && (this.selectedItem.Id || this.selectedItem.id)
					? this.selectedItem.Id || this.selectedItem.id
					: -1,
			user_id: this.userProfile.id,
			created_by: `${this.userProfile.first_name} ${this.userProfile.other_names || ""} ${this.userProfile.surname}`,
			amount: this.assessmentForm.get("amount").value,
			payer_name: !["1", "3"].includes(this.userProfile.role)
				? this.tins.find(
					(el) => el.tin == this.assessmentForm.value.tin_slug.tin
				).company_name
				: this.tins.find((el) => el.tin == this.assessmentForm.value.tin_slug),
			rules: {
				description: this.assessmentForm.get("description").value,
			},
		};

		this.saveAssessment(assessment, (result = null));
	}

	formatNumber(x: number) {
		return x
			? x
				.toFixed(2)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			: x;
	}

	formatText(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}

	showError(errSubject: string, errMsg: string) {
		this.toastService.error(errMsg, errSubject, {
			timeOut: 3000,
			closeButton: true,
			progressBar: true,
		});
	}

	validateCustomForm(elements: any) {
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].required && elements[i].value.length < 1) {
				return false;
			}
		}
		return true;
	}

	proceedPsirs() { }

	parseUrl(url) {
		console.log('user Profile', this.userProfile);
		if (!this.userProfile.mda_id) {
			return `${url}?mda_id=${this.userProfile.mda_id}`
		} else {
			return url;
		}
	}
}
