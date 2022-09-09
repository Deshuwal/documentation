import { Component, OnInit } from "@angular/core";

import { EChartOption } from "echarts";
import { LocalStoreService } from "../../../shared/services/local-store.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
import {
	forkJoin
} from "rxjs";
import { Title } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { OldPlatformNegotiatorService } from "src/app/shared/services/old_platform_negotiator";
import { Page } from "src/app/shared/models/Page";


@Component({
	selector: "app-dashboad-default",
	templateUrl: "./mdas-breakdown.html",
	styleUrls: ["./mdas-breakdown.css"],
})
export class MDASBreakdown implements OnInit {
	chartLineOption1: EChartOption;
	chartLineOption2: EChartOption;
	chartLineOption3: EChartOption;
	salesChartBar: EChartOption;
	salesChartPie: EChartOption;

	flash:boolean = true;
	flash2:boolean = true;
	// selectedCar: number;
	isAdmin: Boolean;
	revenueBreakDown=[{tax_item:"PAYE",totalRevenue:6557788,overAllPercent:'788%'},{tax_item:"PAYE",totalRevenue:6557788,overAllPercent:'788%'},{tax_item:"PAYE",totalRevenue:6557788,overAllPercent:'788%'}];

	loading = false;
	// addedCompanies: any[] = [];
	companies: any[] = [];

	userProfile: any;

	title = "angular-ngselect-typeahead-app";
	companyTINCount = 0;
	IndividualTINCount = 0;
	// companies$: Observable<any>;
	companiesLoading = false;

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

	paymentChannels = [];
	paymentChannelsSum = 0;
	psirsTotalAssessments = 0;
	todayAssessmentsAmount= 0;
	psirsTotalPAYEAssessments = 0;
	psirsTotalOtherAssessments = 0;
	mdaAssessmentBreakdowns = 0;
	filteredMdaAssessmentBreakdowns = [];

	ngOnInit() {
		this.headTitle.setTitle("Dashboard");
		let title: any = undefined;

		let profile = JSON.parse(localStorage["user"]);
		this.isAdmin = ["1", "3"].includes(profile.role);
		this.userProfile = profile;

		title = `Reporting Dashboard`;
		this.breadcrumb.setCrumbItem("dashboardHome", title);
		this.getPaymentChannelPayments();
		// this.getPSIRSRevenueBreakdown();
		this.getMDARevenueBreakdown(); 
	
	}

	parseUrl(url) { 
		if(this.userProfile.mda_id && this.userProfile.role!=='1' && parseInt(this.userProfile.mda_id) > 0) {
			return `${url}?mda_id=${this.userProfile.mda_id}`
		}
		return url;
	}

	psirsTotalAmount:string ="";
	otherMdasTotalAmount:string="";
	psirsRevenuePercentage:number = 0;
	mdasRevenuePercentage:number =0;

	getPaymentChannelPayments() {
		this.loading = true;
		let payment_channels = this.parseUrl('reports/payment_channels');
		this.dl.doGet(payment_channels).subscribe(
			(res:any) => {
				// console.log('viva', res);
				this.paymentChannelsSum = res.kudi + res.opay + res.wallet + res.nibss + res.paydirect + res.psirs_customer_service;
				this.loading = false; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
	}

	
	
	getMDARevenueBreakdown() {
		let mda_revenue_breakdown = this.parseUrl('reports/mda_revenue_breakdown');
		this.loading = true;
		
		this.dl.doGet(mda_revenue_breakdown).subscribe(
			(res:any) => {
				// console.log('mda_revenue_breakdown',res)
				this.mdaAssessmentBreakdowns = res;
				if(res.length > 0) {
					this.filteredMdaBreakdowns(res);
				}
				this.loading = false; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
	}

	filteredMdaBreakdowns(mdas: any) {
		for (let [key, value] of Object.entries(mdas)) {
			if(value[0].mda_name != null) {
				value[0].percentage = (value[0].total / this.paymentChannelsSum) * 100;
				this.filteredMdaAssessmentBreakdowns.push(value[0]);
			}
		}

		this.filteredMdaAssessmentBreakdowns.sort((a:any, b:any) => (b.percentage > a.percentage)? 1:-1);
	}

	calculatePercentage(value, total) {
		return (parseInt(value) / parseInt(total)) * 100;
	}

	pagination: Page = new Page();
	BRNField: string;
  	searchField: string;

	
	selectedMDA: any = null;
	paymentTotal: number = 0;
	from: string;
	to: string;
	assessments: any;
	filteredItems: any[] = [];
	isSearching: boolean = false;
	isReset: boolean = false;

	filterByDate(resetPagination: boolean = false) {
		if (resetPagination) {
		  this.pagination.setCurrentPage(0);
		}

		this.isSearching = true;

		let mda_revenue_breakdown = this.parseUrl('reports/mda_revenue_breakdown');
		let payment_channels = this.parseUrl('reports/payment_channels');
		let period = `&from=${this.from}&to=${this.to}`;
	
		const requests = [
			this.dl.doGet(`${payment_channels}?${period}&page=${this.pagination.currentPage}`),
			this.dl.doGet(`${mda_revenue_breakdown}?${period}&page=${this.pagination.currentPage}`),
		];

		forkJoin(requests).subscribe(
			(result: any[]) => {
				console.log("Filtered results ", result);

				// Filter Payment Channels
				// this.paymentChannels = result[1];
				this.paymentChannelsSum = result[0].kudi + result[0].opay + result[0].wallet + result[0].nibss + result[0].paydirect + result[0].psirs_customer_service;

				// // Filter Other MDA vs PSIRS Breakdown
				this.mdaAssessmentBreakdowns = result[1];
				if(result[1].length > 0) {
					this.filteredMdaBreakdowns(result[1]);
				}

				this.isSearching = false;
				this.isReset = true;
			},
			(error) => {
				// log error
				console.log({ error });
				this.isSearching = false;
				this.isReset = false;
			}
		);
	}

	reloadCurrentPage() {
		window.location.reload();
	}

}
