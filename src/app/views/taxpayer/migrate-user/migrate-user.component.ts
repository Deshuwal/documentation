import { Component, OnInit, ViewChild, OnChanges, Input } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

import {
	NgbModal,
	ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { TinService } from "src/app/shared/services/tinservice";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { DropdownDataService } from "src/app/shared/services/dropdown-data.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./migrate-user.component.html",
	styleUrls: ["./migrate-user.component.scss"],
	animations: [SharedAnimations],
})
export class MigrateUserComponent implements OnInit {
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
	constructor(
		private tinService: TinService,
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private router: Router,
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
			
			tin: ["", Validators.required],
			bvn: [""],
		});

		this.userProfile = this.localStore.getItem("user");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.breadcrumb.setCrumbItem("dashboardMigrateUser");

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

			let url = "/users/admin_migrate_user";

			this.addCompanyForm.value.pre_tin = pre_tin;

			this.dl
				.doPost(url, { ...this.addCompanyForm.value, source: "mda-admin" })
				.subscribe(
					(res: any) => {
						this.isSubmitted = false;

						this.addUserLoading = false;
						if (res && res.status && res.status == "success") {
							this.toastr.success("Success", "User Successfully created!", {
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							});
							this.addCompanyForm.patchValue({
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
							this.addCompanyForm.reset();
							this.modalService.dismissAll("dismiss");
							this.navigateToUsersList();
						} else {
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

	get addCompany() {
		return this.addCompanyForm.controls;
	}

	print() {
		window.print();
	}

	navigateToUsersList() {
		this.router.navigateByUrl("/setup/assign-role");
	}

}
