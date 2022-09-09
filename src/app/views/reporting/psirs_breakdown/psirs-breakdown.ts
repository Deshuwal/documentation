import { Component, OnInit } from "@angular/core";

import { EChartOption } from "echarts";
import { echartStyles } from "../../../shared/echart-styles";
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
import {Subscription, timer} from 'rxjs';  


@Component({
	selector: "app-dashboad-default",
	templateUrl: "./psirs-breakdown.html",
	styleUrls: ["./psirs-breakdown.css"],
})
export class PsirsBreakdown implements OnInit {
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

	displayAllManualAssessments:boolean = false;
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
	totalPayments = 0;
	totalAssessments = 0;
	paymentChannels = [];
	paymentChannelsSum = 0;
	psirsTotalAssessments = 0;
	todayAssessmentsAmount= 0;
	psirsTotalPAYEAssessments = 0;
	psirsTotalOtherAssessments = 0;
	automatedAssessments=0;
	manualAssessments=0;
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
		this.getPSIRSRevenueBreakdown();
		this.getMDARevenueBreakdown(); 
	
	}


	 
	 

	 
	parseUrl(url) { 
		if(this.userProfile.mda_id && this.userProfile.role!=='1' && parseInt(this.userProfile.mda_id) > 0) {
			return `${url}?mda_id=${this.userProfile.mda_id}`
		}
		return url;
	}
 

	revenueToday: any
	currentMonthRevenue: any
 
 

	 

	psirsTotalAmount:number =0;
	otherMdasTotalAmount:number=0;
	psirsRevenuePercentage:number = 0;
	mdasRevenuePercentage:number =0;

	getPsirsVsOtherMdas(){
		let totalMdas:number = 0;
		let totalPSIRS:number = 0;
		this.filteredMdaAssessmentBreakdowns.forEach((mda:any)=>{
			if(mda.mda_name.trim()!="PLATEAU STATE INTERNAL REVENUE SERVICE"){
				totalMdas+=Number(mda.total);
			}
			else{
				totalPSIRS = Number(mda.total);
			}
		});
		this.otherMdasTotalAmount = totalMdas;
		let totalPSirsAndMdas:number = totalMdas + totalPSIRS; 
		this.mdasRevenuePercentage = totalMdas/totalPSirsAndMdas *100;
		this.psirsRevenuePercentage = totalPSIRS/totalPSirsAndMdas * 100;
		this.psirsTotalAmount = totalPSIRS; 
	}

	getPaymentChannelPayments() {
		this.loading = true;
		let payment_channels = this.parseUrl('reports/payment_channels');
		this.dl.doGet(payment_channels).subscribe(
			(res:any) => {
				this.paymentChannels = res;
				console.log("channels ", res);
				this.paymentChannelsSum = res.kudi + res.opay + res.wallet + res.nibss + res.paydirect + res.psirs_customer_service + res.monnify;
				console.log("channels", this.paymentChannelsSum);
				
				this.loading = false; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
	}

	getPSIRSRevenueBreakdown() {
		let psirs_revenue_breakdown = this.parseUrl('reports/psirs_revenue_breakdown');
		this.loading = true;
		
		this.dl.doGet(psirs_revenue_breakdown).subscribe(
			(res:any) => {
				console.log("result breakdiwon ", res);
				this.psirsTotalAssessments = res.total;
				this.automatedAssessments = res.categorized;
				this.manualAssessments= res.uncategorized
				//this.psirsTotalPAYEAssessments = res.paye;
				//this.psirsTotalOtherAssessments = res.others;
				//console.log(this.manuallyGroupPsirsPayments(res.categorized, res.uncategorized));
				this.loading = false; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
	}
	
	extractTitleFromGenericAssessment(rules){

		let rulesObj = JSON.parse(rules);

		return rulesObj.description;
	}

	manuallyGroupPsirsPayments(categorizedItems:any[], uncategorized:any[]){

		let key_groupings:string[] = ["Vehicle Licence", "PAYE", "MLA", "development levy", "wht", "witholding tax", "direct assessment", "tax audit"];

		let results:any[] = [];
		results['others'] = 0;
		uncategorized.forEach((item:any) => {

			let groupedFlag= false;
			key_groupings.forEach((group:string) => {

				if(!item.title) item.title="others";
				console.log("item", item, "group ", group);
				if(item.title.toLowerCase().indexOf(group) > -1){

					groupedFlag = true;
					if(results[group] != undefined){
						results[group] += item.ammount_aggr;
					}
					else{ 
						results[group] = item.amount_aggr;
					}
				}
			});

			if(!groupedFlag){

				results['others']+=item.amount_aggr;
			}

		 });

		 return results;

	}

	getMDARevenueBreakdown() {
		let mda_revenue_breakdown = this.parseUrl('reports/mda_revenue_breakdown');
		this.loading = true;
		
		this.dl.doGet(mda_revenue_breakdown).subscribe(
			(res:any) => {
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
		this.getPsirsVsOtherMdas();
	}

	calculatePercentage(value, total) {
		let result = (parseInt(value) / parseInt(total)) * 100;
 
			// console.log("Nan", value, total, result);
		
		return result;
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
	
		let period = `&from=${this.from}&to=${this.to}`;
		
		let psirs_revenue_breakdown = this.parseUrl('reports/psirs_revenue_breakdown');
		let payment_channels = this.parseUrl('reports/payment_channels');
		let mda_revenue_breakdown = this.parseUrl('reports/mda_revenue_breakdown');

		const requests = [
			this.dl.doGet(`${psirs_revenue_breakdown}?${period}&page=${this.pagination.currentPage}`),
			this.dl.doGet(`${payment_channels}?${period}&page=${this.pagination.currentPage}`),
			this.dl.doGet(`${mda_revenue_breakdown}?${period}&page=${this.pagination.currentPage}`),
		];

		forkJoin(requests).subscribe(
			(result: any[]) => {
				console.log("Filtered results ", result);

				// Filtered PSIRS Revenue Breakdown
				this.psirsTotalAssessments = result[0].paye + result[0].others;
				this.psirsTotalPAYEAssessments = result[0].paye;
				this.psirsTotalOtherAssessments = result[0].others;

				// Filter Payment Channels
				this.paymentChannels = result[1];
				console.log("channels total ", result[1]);
				this.paymentChannelsSum = result[1].kudi + result[1].opay + result[1].wallet + result[1].nibss + result[1].paydirect + result[1].monnify;

				// Filter Other MDA vs PSIRS Breakdown
				if(result[2].length > 0) {
					this.filteredMdaBreakdowns(result[2]);
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
