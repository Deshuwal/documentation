import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { fromEvent, Observable } from "rxjs";
import { Page } from "src/app/shared/models/Page";
import { Exporter } from "src/app/shared/models/exporter";

import {
	filter,
	debounceTime,
	distinctUntilChanged,
	tap,
} from "rxjs/operators";

import { ActivatedRoute } from "@angular/router";
import states from "../../../../assets/data/state.json";
import industries from "../../../../assets/data/industries.json";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { FromUnixPipe } from "angular2-moment";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./manage_companies.component.html",
	styleUrls: ["./manage_companies.component.scss"],
	animations: [SharedAnimations],
})
export class Manage_companiesComponent implements OnInit {
	loading: boolean = false;

	assessments = [];

	cache: any = {};

	editCompanyForm: FormGroup;

	companies: any[] = [];

	@ViewChild("modalConfirm", { static: false }) private modalContent;
	@ViewChild("input", { static: false }) input: ElementRef;

	userProfile: any;
	page: number = 1;

	filteredItems: any[] = [];
	next_page: number;
	page_count: number;
	per_page_count: number;
	previous_page: number;
	result_count: number;
	pageNumber: number;
	total_count: number;

	exporter: Exporter = new Exporter();
	pagination: Page = new Page();

	public states: any = [];
	public lgas: any = [];
	public industries: any = [];
	public viewedCompany: any = {};

	public selectedCompanyId: any = "";

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private breadcrumb: BreadcrumbService
	) {}

	setPage(info: any) {
		console.log("clicked set page", info);
		this.pagination.setCurrentPage(info.offset);

		console.log("pagination now at " + this.pagination.currentPage);

		this.filterRecord();
	}

	exportToExcel() {
		let headers: string[] = [];
		headers.push("id");
		headers.push("company_name");
		headers.push("business_industry");
		headers.push("tin");
		headers.push("created_at");

		let csv = this.exporter.getCsVCompaniesList(this.assessments, headers);
		console.log("exporting", csv);
	}

	tinOrPhoneNumberField: string;
	from: string;
	to: string;

	filterRecord() {
		this.loading = true;
		this.searching = true;
		let params: any = {};

		params.search = this.tinOrPhoneNumberField;
		params.from = this.from;
		params.to = this.to;
		params.page = this.pagination.currentPage;

		console.log("params ", params);

		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doPost("users/list_companies", params)
			.subscribe(
				(res: any) => {
					console.log("result listing companies", res);

					this.loading = false;
					this.searching = false;
					this.assessments = res.list.map((item, idx) => ({
						...item,
						sn: idx + 1,
					}));
					this.pagination.setTotalItemCount(res.items_count);
					console.log(this.pagination);
				},
				(err) => {
					this.loading = false;
					this.searching = false;
					this.toastr.error(
						"An error occured... Please verify that the filter params are correct"
					);
				}
			);
	}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("setupCompany");

		this.route.params.forEach((e: any) => {
			if (e.status) this.status = e.status;
		});

		this.route.params.subscribe((params) => {
			this.status = params["status"];
		});

		this.loadCompanies({ offset: 0 });

		this.editCompanyForm = this.fb.group({
			company_name: ["", Validators.required],
			rc_no: ["", Validators.required],
			business_industry: ["", Validators.required],
			tin: ["", Validators.required],
			employee_count: ["", Validators.required],
			lga: ["", Validators.required],
			state: ["", Validators.required],
			industry: ["", Validators.required],
			address: ["", Validators.required],
			employees: ["", Validators.required],
			website: ["", Validators.required],
			email: ["", Validators.required],
			office_number: ["", Validators.required],
		});

		this.fetchState();
		this.fetchIndustries();
		this.fetchCompanies();

		this.showCompanyNameInput = true;
	}

	showCompanyNameInput: boolean = true; //1
	showTinInput: boolean = false; //2
	showRCInput: boolean = false; //3
	showPhoneInput: boolean = false; //4

	selectedOption: string;

	onChange(selected) {
		console.log({ selected });

		if (selected == "company_name") {
			this.showCompanyNameInput = true;
			this.showTinInput = false;
			this.showRCInput = false;
			this.showPhoneInput = false;
		} else if (selected == "rc_no") {
			this.showCompanyNameInput = false;
			this.showTinInput = false;
			this.showRCInput = true;
			this.showPhoneInput = false;
		} else if (selected == "tin") {
			this.showCompanyNameInput = false;
			this.showTinInput = true;
			this.showRCInput = false;
			this.showPhoneInput = false;
		} else if (selected == "phone") {
			this.showCompanyNameInput = false;
			this.showTinInput = false;
			this.showRCInput = false;
			this.showPhoneInput = true;
		} else {
			this.showCompanyNameInput = true;
			this.showTinInput = false;
			this.showRCInput = false;
			this.showPhoneInput = false;
		}
		this.selectedOption = selected;
	}

	inputParamToSearch: any;

	paramToSearch(e) {
		// console.log({ e });
		this.inputParamToSearch = e.target.value;
	}

	searching: boolean = false;

	onPageChange(pageInfo) {
		this.pageNumber = pageInfo.offset;

		// Calculate row offset in the UI using pageInfo
		// This is the scroll position in rows
		const rowOffset = pageInfo.offset * pageInfo.pageSize;

		// When calling the server, we keep page size fixed
		// This should be the max UI pagesize or larger
		// This is not necessary but helps simplify caching since the UI page size can change
		const page = { size: 10, pageNumber: pageInfo.offset + 1 };
		page.size = 10;
		// page.pageNumber = pageInfo.offset + 1;
		this.pageNumber = pageInfo.offset + 1;

		console.log("page number", pageInfo, this.cache);
		// We keep a index of server loaded pages so we don't load same data twice
		// This is based on the server page not the UI
		if (this.cache[page.pageNumber]) return;
		this.cache[page.pageNumber] = true;

		let url = "users/list_companies/" + (pageInfo.offset + 1);
		this.loading = true;

		this.dl.doGet(url).subscribe(
			(res: any) => {
				console.log("loaded companies katz", res);
				if (res.length < 1) {
					this.toastr.info("No companies found ", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res.data.result.map((company, idx) => ({
					...company,
					sn: idx + 1,
				}));
				this.next_page = res.data.next_page;
				this.page_count = res.data.page_count;
				this.per_page_count = res.data.per_page_count;
				this.previous_page = res.data.next_page - 1;
				this.result_count = res.data.per_page_count;
				this.total_count = res.data.total_count;
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	loadCompanies(pageInfo) {
		this.loading = true;
		this.pageNumber = pageInfo.offset;

		let url = "users/list_companies/" + 1;

		this.dl.doPost(url, {}).subscribe(
			(res: any) => {
				console.log("result load companies", res);
				if (res.length < 1) {
					this.toastr.info("No companies found ", "Empty!", { timeOut: 3000 });
				}
				this.assessments = res.list;
				this.pagination.setTotalItemCount(res.items_count);
				this.total_count = res.items_count;
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				console.log("error fetching tax items", err);
			}
		);
	}

	closeResult = "";

	openEditCompanyModal(content, item) {
		if (item) {
			this.viewedCompany = this.companies.find((company) => company.id == item);
			this.selectedCompanyId = item.id;
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

		this.editCompanyForm.patchValue({
			company_name: item.company_name,
			tin: item.tin,
			rc_no: item.rc_no,
			employee_count: item.employee_count,
			state: item.state,
			lga: item.lga,
			business_industry: item.business_industry,
			address: item.address,
			email: item.email,
			office_number: item.office_number,
			website: item.website,
		});
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

	getCompanies(term: string = null): Observable<any> {
		return this.dl.doGet("/users/search_companies?company_name=" + term);
	}

	fetchIndustries() {
		this.industries = industries.map((industry) => industry);
	}

	fetchCompanies() {
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

	fetchState() {
		const nigeriaStates = states.map((state) => state.state);
		this.states = nigeriaStates;
	}

	getSelectedState() {
		let stateSelected = this.editCompanyForm.value.state;
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

	updateCompany() {
		let id = this.selectedCompanyId;
		this.loading = true;
		let data = this.editCompanyForm.getRawValue();
		this.dl.doPost("users/update_company/" + id, data).subscribe(
			(response) => {
				this.loading = false;
				this.successEditingCompany();
			},
			(error) => {
				console.log(error);
				this.loading = false;
			}
		);
	}

	successEditingCompany() {
		this.toastr.success("Company updated Successfully!", "Success!", {
			timeOut: 10000,
			closeButton: true,
			progressBar: true,
		});
		this.closeModal();
		this.fetchCompanies();

		let win: any = window;
		win.location.reload();
	}

	closeModal() {
		this.modalService.dismissAll();
	}
}
