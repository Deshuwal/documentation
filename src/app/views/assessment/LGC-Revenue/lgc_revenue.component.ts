import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import { concat, Observable, of, Subject } from "rxjs";
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	tap,
} from "rxjs/operators";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import {
	RevenueHead,
	RevenueHeadSUB,
} from "src/app/shared/constants/lgc-revenue";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { HttpService } from "src/app/shared/services/http.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
	selector: "app-personal-income-tax",
	templateUrl: "./lgc_revenue.component.html",
	styleUrls: ["./lgc_revenue.component.scss"],
	animations: [SharedAnimations],
})
export class LgcRevenueComponent implements OnInit {
	preForm: FormGroup;
	loading: boolean;
	RevenueHeadSUBCat: any[];
	modal: NgbModal;
	data: any;
	public userProfile: any;
	submitted = false;

	@ViewChild("modalConfirm", { static: false }) private modalContent;

	lgc = [
		{ name: "Barkin Ladi" },
		{ name: "Bassa" },
		{ name: "Bokkos" },
		{ name: "Jos-East" },
		{ name: "Jos-North" },
		{ name: "Jos-South" },
		{ name: "Kanam" },
		{ name: "Kanke" },
		{ name: "Langtang-North" },
		{ name: "Langtang South" },
		{ name: "Mangu" },
		{ name: "Mikang" },
		{ name: "Pankshin" },
		{ name: "Qua'an Pan" },
		{ name: "Riyom" },
		{ name: "Shendam" },
		{ name: "Wase" },
	];
	amount: number;
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private http: HttpService,
		private toastService: ToastrService,
		private modalService: NgbModal,
		private localStore: LocalStoreService,
		private printPDF: PrintpdfService,
		private breadcrumb: BreadcrumbService
	) {}

	ngOnInit() {
		this.loadTins();

		this.userProfile = this.localStore.getItem("user");
		this.breadcrumb.setCrumbItem("lgcrevenues");

		this.route.queryParams.subscribe((params) => {
			this.loading = true;

			this.loading = false;
		});
		this.preForm = this.fb.group({
			payer_tin: ["", Validators.required],
			payer_name: ["", Validators.required],
			start_tax_period: ["", Validators.required],
			lgc: ["", Validators.required],
			end_tax_period: ["", Validators.required],
			revenue_head: ["", Validators.required],
			revenue_head_sub: ["", Validators.required],
			geo_area: ["", Validators.required],
		});
		this.preForm.get("revenue_head").valueChanges.subscribe((selectedValue) => {
			this.RevenueHeadSUBCat = RevenueHeadSUB.find(
				(el) => el.key == selectedValue.key
			)
				? RevenueHeadSUB.find((el) => el.key == selectedValue.key).taxes
				: [];
		});

		// this.preForm.get("geo_area").valueChanges.subscribe((selectedValue) => {
		// 	const amount = this.preForm.value.revenue_head_sub.type[selectedValue];
		// 	this.amount = +amount;
		// 	console.log({ amount });
		// });
	}

	config = {
		displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
		search: true,
		limitTo: 50,
		moreText: "More",
		searchPlaceholder: "Search by TIN.",
		noResultsFound: "No results found!",
		searchOnKey: "tin",
	};

	get businessCategoryConfig() {
		return {
			displayKey: "description",
			search: false,
			placeholder: "Select Revenue Head Category",
		};
	}

	get businessTypeConfig() {
		return {
			displayKey: "REVENUE_HEAD",
			search: true,
			moreText: "See More",
			placeholder: "Select Revenue Head Sub Catergory",
			noResultsFound: "Revenue Sub-head Not Found...",
			searchOnKey: "description",
		};
	}

	get lgcouncileConfig() {
		return {
			displayKey: "name",
			search: true,
			moreText: "See More",
			placeholder: "Select Local Government Council",
			noResultsFound: "Revenue Sub-head Not Found...",
			searchOnKey: "description",
		};
	}

	get RevenueHead() {
		return RevenueHead;
	}

	get preform() {
		return this.preForm.controls;
	}

	get taxf() {
		return this.preForm.controls;
	}

	generateAssessment() {
		this.submitted = true;

		const {
			end_tax_period,
			lgc,
			geo_area,
			payer_name,
			payer_tin,
			revenue_head,
			revenue_head_sub,
			start_tax_period,
		} = this.preForm.value;
		console.log(this.preForm.value);

		if (
			end_tax_period &&
			lgc &&
			geo_area &&
			payer_name &&
			payer_tin &&
			revenue_head &&
			revenue_head_sub &&
			start_tax_period
		) {
			this.loading = true;
			this.amount =
				this.preForm.value.revenue_head_sub.type[this.preForm.value.geo_area];

			this.http
				.doPost("/lgc_revenues/save", {
					amount: this.amount,
					end_tax_period,
					lgc: lgc.name,
					geo_area,
					payer_name,
					payer_tin,
					revenue_head: revenue_head.description,
					revenue_head_sub: revenue_head_sub.REVENUE_HEAD,
					start_tax_period,
					created_by:
						this.userProfile.name != null
							? this.userProfile.name
							: `${this.userProfile.first_name} ${this.userProfile.surname}`,
				})
				.subscribe(
					(res: any) => {
						this.submitted = false;
						this.preForm.patchValue({
							payer_tin: "",
							payer_name: "",
							start_tax_period: "",
							lgc: "",
							end_tax_period: "",
							revenue_head: "",
							revenue_head_sub: "",
							geo_area: "",
						});
						console.log("response ", res);
						this.loading = false;

						if (res.status && res.status == true) {
							this.openConfirmModal();
							this.data = res.data;
							return this.toastService.success("Successful", "Bill generated");
						} else {
							return this.toastService.error(res.reason, "An Error occurred!");
						}
					},
					(err) => {
						this.submitted = false;
						this.loading = true;

						console.log(err);
					}
				);
		}
	}

	parseDate(date) {
		return moment.utc(date).format("MM/DD/YYYY");
	}
	exportAsPDF(div_id) {
		this.printPDF.downloadAssessment(div_id, "lgc_revenue.pdf");
	}
	printPDFS(div_id) {
		this.printPDF.downloadAssessment(div_id, "lgc_revenue.pdf");
	}
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
	foundTIN$: Observable<any>;
	companiesLoading = false;
	companiesInput$ = new Subject<string>();
	minLengthTerm = 2;
	foundTins = [];
	onDropdownClick(item) {
		if (this.preForm.value.payer_tin) {
			console.log({ matches: this.preForm.value.payer_tin });
			const payer_details = this.preForm.value.payer_tin.split(",");

			this.preForm.patchValue({
				payer_tin: payer_details[1],
				payer_name: payer_details[0],
			});
		}
	}

	getCompanies(term: string = null): Observable<any> {
		return this.http.doGet("/users/search_tins?tin=" + term);
	}
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
										payer_name: `${data.first_name}  ${data.surname}`,
										name: `${data.first_name}  ${data.surname} ,${data.tin}`,
									};
								} else {
									return {
										...data,
										payer_name: data.name,
										name: `${data.name}, ${data.tin}`,
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
}
