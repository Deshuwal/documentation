import { Component, OnInit, ViewChild, OnChanges, Input } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
	NgForm,
	FormGroupDirective,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute, Router } from "@angular/router";

import {
	NgbActiveModal,
	NgbModal,
	ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { TinService } from "src/app/shared/services/tinservice";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { DropdownDataService } from "src/app/shared/services/dropdown-data.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./register-user.component.html",
	styleUrls: ["./register-user.component.scss"],
	animations: [SharedAnimations],
})
export class RegisterComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any[];
	taxItems: any;
	addCompanyForm: FormGroup;
	active = 2;
	currentJustify = "fill";
	@ViewChild("modalConfirm", { static: false }) private modalContent;
	statuses;
	employement_statuses: string[] = [
		"Student",
		"Employed",
		"Self-Employed",
		"Unemployed",
	];
	countries: string[] = this.dropdownDataService.countries;
	public states: string[] = this.dropdownDataService.states;
	public lgas: string[] = [];
	occupations: string[];

	registration_response: string = "";

	userProfile: any;

	filteredItems: any[] = [];

	searchControl: FormControl = new FormControl();

	config = {
		search: true,
		limitTo: 200,
		placeholder: "Select",
		noResultsFound: "No results!",
	};

	status: any;

	submitted = false;
	constructor(
		private tinService: TinService,
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private router: Router,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService,
		private dropdownDataService: DropdownDataService
	) {}

	ngOnInit() {
		this.dropdownDataService.fetchOccupations().subscribe(
			(occupations: { name: string }[]) =>
				(this.occupations = occupations.map((occupation) => occupation.name)),
			(err) => (this.occupations = [])
		);
		this.dropdownDataService.fetchStatus().subscribe(
			(statuses: { name: string }[]) =>
				(this.statuses = statuses.map((status) => status.name)),
			(err) => (this.statuses = [])
		);
		this.addCompanyForm = this.fb.group({
			first_name: ["", Validators.required],
			surname: ["", Validators.required],
			other_names: [""],
			home_town: ["", Validators.required],
			nationality: ["", Validators.required],
			gender: ["", Validators.required],
			marital_status: ["", Validators.required],
			soo: ["", Validators.required],
			payer_address: ["", Validators.required],
			lga: ["", Validators.required],
			emp_status: ["", Validators.required],
			dob: ["", Validators.required],
			occupation: ["", Validators.required],
			phone: [""],
			email: [""],
			title: ["", Validators.required],
			nin: [""],
			bvn: [""],
		});

		this.userProfile = this.localStore.getItem("user");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.breadcrumb.setCrumbItem("dashboardRegisterUser");

		this.route.params.subscribe((params) => {
			this.status = params["status"];
			this.loadAssessments(); // reset and set based on new parameter this time
		});

		this.loadAssessments();
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}
	
	get addCompany() {
		return this.addCompanyForm.controls;
	}

	checkPasswords(group: FormGroup) {
		// here we have the 'passwords' group
		const password = group.get("password").value;
		const confirmPassword = group.get("confirm_password").value;
		return password === confirmPassword ? null : { notSame: true };
	}
	closeResult = "";

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}

	open(content) {
		this.modalService
			.open(content, { ariaLabelledBy: "modal-basic-title" })
			.result.then(
				(result) => {
					this.closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);
	}

	closeModal() {
		this.modalService.dismissAll();
	}

	getSelectedState() {
		this.lgas = this.dropdownDataService.getSelectedLga(
			this.addCompanyForm.value.soo
		);
	}

	addUserLoading = false;
	errMsg: any = {};
	isSubmitted = false;
	addUser() {
		this.isSubmitted = true;
		let pre_tin = this.tinService.getPreTin(
			this.addCompanyForm.value.soo,
			this.addCompanyForm.value.lga
		);

		if (this.addCompanyForm.valid) {
			this.addUserLoading = true;

			let url = "/users/admin_post_user";

			this.addCompanyForm.value.pre_tin = pre_tin;

			this.dl
				.doPost(url, { ...this.addCompanyForm.value, source: "mda-admin" })
				.subscribe(
					(res: any) => {
						this.isSubmitted = false;

						this.addUserLoading = false;
						if (res && res.status && res.status == "success") {//checker
							this.toastr.success("Success", "User Successfully created!", {
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							});
							this.addCompanyForm.patchValue({//emptying files after a successful submit
								first_name: "",
								surname: "",
								other_names: "",
								home_town: "",
								nationality: "",
								gender: "",
								marital_status: "",
								soo: "",
								payer_address: "",
								lga: "",
								emp_status: "",
								dob: "",
								occupation: "",
								phone: "",
								email: "",
								title: "",
								nin: "",
								bvn: "",
							});
							this.registration_response = "success";
							this.addCompanyForm.reset();//an alternative
							this.modalService.dismissAll("dismiss");//dismiss all notification after success
						} else {//check if its either not network issue or network issue
							this.isSubmitted = false;
							this.toastr.error("Failed!", "Network error. Try again", {
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							});
						}
					},
					(err) => {
						console.log(err.errors);
						if (err.error.errors) {
							Object.entries(err.error.errors).forEach((err) => {
								console.log({ err });
								this.toastr.error(
									err[0],
									`${err[0]} is already associated with an account`,
									{
										timeOut: 10000,
										closeButton: true,
										progressBar: true,
									}
								);
							});
						}
						this.addUserLoading = false;
					}
				);
		} else {
			this.toastr.error("Failed!", "Please fill all compulsory fields", {
				timeOut: 10000,
				closeButton: true,
				progressBar: true,
			});
		}
	}

	print() {
		window.print();
	}

	navigateToUsersList() {
		this.router.navigateByUrl("/setup/assign-role");
	}
//not valuable for now 
	loadAssessments() {
		this.loading = true;

		let url = "users/list/" + 1;

		this.dl.doGet(url).subscribe(
			(res: any) => {
				if (res.length < 1) {
					this.toastr.info("No vendor found ", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res.data.result.map((user, idx) => ({
					...user,
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

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}
