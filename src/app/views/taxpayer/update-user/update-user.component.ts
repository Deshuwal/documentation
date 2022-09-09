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
import occupations from "../../../../assets/data/occupations.json";
import status from "../../../../assets/data/status.json";
import states from "../../../../assets/data/state.json";
import { ActivatedRoute, Router } from "@angular/router";
import { ManageUserService } from "../../mda-admin/manage_users/manage-user.service";

import {
	NgbActiveModal,
	NgbModal,
	ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { Title } from "@angular/platform-browser";
import { DropdownDataService } from "src/app/shared/services/dropdown-data.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./update-user.component.html",
	styleUrls: ["./update-user.component.scss"],
	animations: [SharedAnimations],
})
export class UpdateComponent implements OnInit {
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
	statuses = status;
	employement_statuses: string[] = [
		"Student",
		"Self-Employed",
		"Employed",
		"Unemployed",
	];
	public maxDate = new Date().toISOString().split("T")[0];
	public states: string[] = [];
	public lgas: string[] = [];
	userToUpdate: any;
	@ViewChild("modalConfirm", { static: false }) private modalContent;
	userProfile: any;
	filteredItems: any[] = [];
	countries: string[] = this.dropdownDataService.countries;

	searchControl: FormControl = new FormControl();
	occupations: string[] = occupations.map((e) => this.capitalizeFirstLetter(e));
	id: string;
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
		private manageUserService: ManageUserService,
		private breadcrumb: BreadcrumbService,
		private headTitle: Title,
		private dropdownDataService: DropdownDataService
	) {
		this.route.params.subscribe((params) => {
			this.id = params["id"];
		});
	}

	ngOnInit() {
		this.headTitle.setTitle("Update Profile");
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
			// age: ["", Validators.required],
			dob: ["", Validators.required],
			occupation: ["", Validators.required],
			phone: ["", Validators.required],
			email: [""],
			title: ["", Validators.required],
			nin: [""],
			bvn: [""],
		});
		this.fetchState();

		this.dl.doGet("users/get_user_by_id/" + this.id).subscribe(
			(res: any) =>
				this.addCompanyForm.patchValue({
					...res.data,
					address: res.data.payer_address,
					title: res.data.title_string,
					lga: res.data.lga,
					dob: this.parseISOString(res.data.dob),
				}),
			(err) => this.route
		);

		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("dashboardUpdateUser");

		// this.router.data.subscribe((data: any[]) => {
		//   const users = data["users"] || [];
		//   this.userToUpdate = users.find((user) => user.id == this.id);
		//   console.log({ userToUpdate: this.userToUpdate });
		// });

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.route.params.subscribe((params) => {
			this.status = params["status"];
			this.loadAssessments(); // reset and set based on new parameter this time
		});

		//this.loadTaxItems();
		//this.loadMdas()
		this.loadAssessments();
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
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
	config = {
		search: true,
		limitTo: 10,
		placeholder: "Select",
		noResultsFound: "No results!",
	};

	parseISOString(s) {
		var b = s ? s.split(/\D+/) : new Date();
		return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
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
	get addCompany() {
		return this.addCompanyForm.controls;
	}

	closeModal() {
		this.modalService.dismissAll();
	}
	fetchState() {
		this.states = states.map((state) => state.state);
	}

	getSelectedState() {
		let stateSelected = this.addCompanyForm.value.soo;
		console.log({ stateSelected });

		for (let i = 0; i < this.states.length; i++) {
			if (this.states[i] == stateSelected) return this.states[i];
			this.fetchLGAs(stateSelected);
		}
		return null;
	}

	fetchLGAs(selectedState) {
		states.map((state) => {
			if (state.state === selectedState) {
				return (this.lgas = state.lgas);
			}
			return null;
		});
	}

	addUserLoading = false;
	errMsg: any;
	isSubmitted = false;

	updateUser() {
		this.isSubmitted = true;

		console.log(this.addCompanyForm.valid, this.addCompanyForm.value);
		if (this.addCompanyForm.valid) {
			this.addUserLoading = true;

			let url = "/users/admin_update_user/" + this.id;
			this.dl
				.doPost(url, {
					...this.addCompanyForm.value,
					employment_status: this.addCompanyForm.value.emp_status,
				})
				.subscribe(
					(res) => {
						this.isSubmitted = false;

						this.addUserLoading = false;
						this.toastr.success("Success", "User Successfully updated!", {
							timeOut: 10000,
							closeButton: true,
							progressBar: true,
						});
						this.addCompanyForm.reset();
						this.modalService.dismissAll("dismiss");
						this.loadAssessments();
					},
					(err) => {
						this.isSubmitted = false;

					///	console.log(err.error.errors);
						if (err.error && err.error.errors) {
							this.errMsg = JSON.stringify(err.error.errors);
						}
						this.addUserLoading = false;
						this.toastr.error("Errors: " + this.errMsg , "User Update Failed", {
							timeOut: 10000,
							closeButton: true,
							progressBar: true,
						});
					}
				);
		}
	}

	print() {
		window.print();
	}

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

	capitalise(words) {
		return (
			words &&
			words
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		);
	}
}
