import { Component, OnInit } from "@angular/core";
import { formatCurrency } from "@angular/common";

import { EChartOption } from "echarts";
import { echartStyles } from "../../../shared/echart-styles";
import { LocalStoreService } from "../../../shared/services/local-store.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
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
	mergeMap,
	tap,
	map,
	filter,
} from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import {
	NgbActiveModal,
	NgbModal,
	ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import states from "../../../../assets/data/state.json";
import industries from "../../../../assets/data/industries.json";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { OldPlatformNegotiatorService } from "src/app/shared/services/old_platform_negotiator";

@Component({
	selector: "app-dashboad-default",
	templateUrl: "./dashboad-default.component.html",
	styleUrls: ["./dashboad-default.component.css"],
})
export class DashboadDefaultComponent implements OnInit {
	chartLineOption1: EChartOption;
	chartLineOption2: EChartOption;
	chartLineOption3: EChartOption;
	salesChartBar: EChartOption;
	salesChartPie: EChartOption;
	selectedCar: number;
	isAdmin: Boolean;
	mdaAdminTitle: string = "";
	mdaDataVisible = true;

	loading = false;
	addedCompanies: any[] = [];
	companies: any[] = [];

	userProfile: any;
	closeResult = "";
	public states: any = [];
	public lgas: any = [];
	public industries: any = [];
	public viewedCompany: any = {};

	addCompanyForm: FormGroup;
	linkCompanyForm: FormGroup;

	title = "angular-ngselect-typeahead-app";
	companyTINCount = 0;
	IndividualTINCount = 0;
	MdaPaymentCount = 0;
	MdaAssessmentCount = 0;
	companies$: Observable<any>;
	companiesLoading = false;
	companiesInput$ = new Subject<string>();
	minLengthTerm = 3;
	selectedMovie: any = null;
	config = {
		// displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 10,
		placeholder: "Select",
		noResultsFound: "No results!",
	};

	public linking = false;
	public submitted = false;
	public linkingCompanyText = "Linking Company...";

	constructor(
		private localStore: LocalStoreService,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private router: Router,
		private toastService: ToastrService,
		private negotiator: OldPlatformNegotiatorService,
		private dl: HttpService,
		private breadcrumb: BreadcrumbService,
		private headTitle: Title
	) {}

	nameProfile = "";

	ngOnInit() {
		this.headTitle.setTitle("Dashboard");
		let title: any = undefined;

		let profile = JSON.parse(localStorage["user"]);
		this.isAdmin = ["1", "3"].includes(profile.role);
		this.userProfile = profile;

		this.nameProfile = this.negotiator.getUserFullName();

		title = `Welcome,  ${this.negotiator.getUserFullName()}`;
		this.breadcrumb.setCrumbItem("dashboardHome", title);

		this.addCompanyForm = this.fb.group({
			company_name: ["", Validators.required],
			rc_no: [""],
			business_industry: ["", Validators.required],
			employee_count: ["", Validators.required],
			lga: ["", Validators.required],
			state: ["", Validators.required],
			industry: ["", Validators.required],
			address: ["", Validators.required],
			employees: ["", Validators.required],
			website: ["", Validators.required],
			email: ["", Validators.required],
			office_number: ["", Validators.required],
			sector: ["Formal"],
		});

		this.linkCompanyForm = this.fb.group({
			tin: ["", Validators.required],
		});

		this.fetchState();
		this.fetchIndustries();
		this.fetchCompanies();
		this.fetchUsers();
		this.loadCompanies();
		this.fetchDashboardData();
		this.getCompayCount();
		this.getUsersCount();
		this.getMdaPaymentCount();
		this.getMdaAssessmentCount();

		if(this.userProfile.role == 3){
			this.mdaDataVisible = false;
		}
	}

	get linkfval() {
		return this.linkCompanyForm.controls;
	}

	getCompayCount() {
		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doGet("users/companies_count")
			.subscribe(
				(res: any) => {
					this.companyTINCount = res.count;
					this.loading = false;
				},
				(err) => {
					this.loading = false;
				}
			);
	}

	getUsersCount() {
		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doGet("users/get_user_count")
			.subscribe(
				(res: any) => {
					this.IndividualTINCount = res.data;
					this.loading = false;
				},
				(err) => {
					this.loading = false;
				}
			);
	}

	getMdaPaymentCount() {
		this.dl
			.doGet("payments/get_mda_total_payment_count")
			.subscribe(
				(res: any) => {
					//console.log("mda pay count", res);
					this.MdaPaymentCount = res.count;
					if(res.mda != null){
						this.mdaAdminTitle = res.mda.title;
					}
					this.loading = false;
				},
				(err) => {
					this.loading = false;
				}
			);
	}

	getMdaAssessmentCount() {
		this.dl
			.doGet("assessment/get_mda_total_assessment_count")
			.subscribe(
				(res: any) => {
					console.log("mda pay count", res);
					this.MdaAssessmentCount = res.count;
					this.loading = false;
				},
				(err) => {
					this.loading = false;
				}
			);
	}

	linkExistingCompany() {
		this.submitted = true;

		if (this.linkCompanyForm.valid) {
			this.linking = true;
			this.dl
				.doPost(`users/link_company`, this.linkCompanyForm.value)
				.subscribe(
					(res: any) => {
						this.toastService.success(
							`${res.data.company_name} Linked.`,
							"Success!",
							{
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							}
						);
					},
					(err: any) => {
						let error = "Error!";
						let message = "Unexpected error. Please retry later";

						if (err.status == 422) {
							error = err.error.message;
							message =
								err.error.errors.tin || "Check form for compulsory fields.";
						} else if (err.status == 0) {
							error = "Connection Error!";
							message = "Connection failed please check your network.";
						} else if (err.status < 500) {
							error = err.statusText;
							message = err.error.message;
						}

						this.linking = false;
						this.submitted = false;

						this.toastService.error(message, error, {
							timeOut: 10000,
							closeButton: true,
							progressBar: true,
						});
					},
					() => {
						this.linking = false;
						this.submitted = false;
						this.closeModal();
						this.fetchCompanies();
					}
				);
		}
	}

	trackByFn(item: any) {
		console.log({ item });
		return item.imdbID;
	}

	onDropdownClick(item) {
		console.log({ clicked: item });
		this.dl.doGet(`users/join_company/${item}`).subscribe(
			(res: any) => {
				const found = this.companies.find(
					(company) => company.id == res.data.id
				);
				!found && this.companies.push(res.data);

				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error adding companies", err);
			}
		);
	}

	totalPayments = 0;
	totalAssessments = 0;

	fetchDashboardData() {
		const requests = [
			this.dl.doGet("payments/list_completed_for_user/" + this.userProfile.id),
			this.dl.doGet("/assessment/list_for_user/" + this.userProfile.id),
		];
		forkJoin(requests).subscribe(
			(result: any[]) => {
				console.log("results dashboard ", result);
				this.totalAssessments = result[0].items_count;
				this.totalPayments = result[0].total;
			},
			(error) => {
				// log error
				console.log({ error });
			}
		);
	}

	loadCompanies() {
		this.companies$ = concat(
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
						map((res) => res.data),
						catchError(() => of([])), // empty list on error
						tap(() => (this.companiesLoading = false))
					);
				})
			)
		);
	}

	getCompanies(term: string = null): Observable<any> {
		console.log({ term });
		return this.dl.doGet("/users/search_companies?company_name=" + term);
	}

	fetchState() {
		const nigeriaStates = states.map((state) => state.state);
		this.states = nigeriaStates;
	}

	fetchIndustries() {
		this.industries = industries.map((industry) => industry);
	}

	addCompany() {
		this.loading = true;

		let url = "users/add_company";

		this.dl.doPost(url, this.addCompanyForm.value).subscribe(
			(res: any) => {
				this.successAddingCompany();
			},
			(err) => {
				// this.successAddingCompany();
				this.dl.displayServerValidautionErrors(err);
				this.loading = false;
			}
		);
	}

	successAddingCompany() {
		this.toastService.success("Company Registration Successful!", "Success!", {
			timeOut: 10000,
			closeButton: true,
			progressBar: true,
		});
		this.closeModal();
		this.fetchCompanies();
	}

	openLogin() {
		this.router;
	}

	onSearch($event) {
		this.loading = true;
		const url = "/users/search_companies?company_name=" + $event.term;
		this.dl.doGet(url).subscribe(
			(res: any) => {
				this.addedCompanies = res.data.map(({ company_name, id }) => ({
					id,
					name: company_name,
				}));
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching companies", err);
			}
		);
	}

	fetchUsers() {
		this.loading = true;

		let url = "/auth/me";

		this.dl.doGet(url).subscribe(
			(res: any) => {
				this.userProfile = res.data;
				localStorage.setItem("user", JSON.stringify(res.data));
			},
			(err) => {
				this.loading = false;
				console.log("error fetching companies", err);
			}
		);
	}

	fetchCompanies() {
		if (this.userProfile.role != "5") {
			this.loading = true;
			let url = "/users/companies/";

			this.dl.doGet(url).subscribe(
				(res: any) => {
					if (res.status == "success") {
						this.companies = [];
						res.data.forEach((company: any) => {
							this.companies.push(company);
						});
					}
					this.loading = false;
				},
				(err) => {
					this.loading = false;
					console.log("error fetching companies", err);
				}
			);
		}
	}

	getSelectedState() {
		let stateSelected = this.addCompanyForm.value.state;
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

	taxEnumView: any = {};
	taxEnumViewType = null;

	unlinkCompany(company: string) {
		this.loading = true;
		this.dl.doGet(`users/unlink_company/${company}`).subscribe(
			(res: any) => {
				const found = this.companies.find(
					(company) => company.id == res.data.id
				);
				!found && this.companies.push(res.data);

				this.loading = false;
				window.location.reload();
			},
			(err) => {
				this.loading = false;
				console.log("error unlinking companies", err);
			}
		);
	}
	open(content, item, type = null) {
		if (type === "company") {
			this.taxEnumView = item;
			this.taxEnumViewType = "company";
		} else if (type === "user") {
			this.taxEnumView = item;
			this.taxEnumViewType = "user";
		} else if (item) {
			this.viewedCompany = this.companies.find((company) => company.id == item);
		}

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

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}
}
