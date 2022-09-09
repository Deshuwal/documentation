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
	templateUrl: "./report.component.html",
	styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit {
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

	nameProfile = "";
	totalPayments = 0;
	totalAssessments = 0;
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

		// this.fetchDashboardData();
		this.getCompayCount();
		this.getUsersCount();
		this.getAllRevenuePaid();
		this.getTodaysRevenue();
		this.getRevenueForCurrentMonth();
		this.getAssessmentsForToday(); 
		this.getTotalAssessmentAmount();
		this.beginFlash();
	
	}


	beginFlash(){

		setInterval(()=>{

			
	
			 this.flash = false;

			setTimeout(()=>{

				this.flash = true;
			}, 500)


		}, 2000);

		setInterval(()=>{

			this.flash2 = false;

			setTimeout(()=>{

				this.flash2 = true;
			}, 500)

			this.getAllRevenuePaid();
			this.getTodaysRevenue();
		}, 5000);
	}

	getCompayCount() {
		this.dl.doGet("users/companies_count").subscribe(
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
		let url =  'users/get_user_count';
		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doGet(url)
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

	parseUrl(url) { 
		if(this.userProfile.mda_id && this.userProfile.role!=='1' && parseInt(this.userProfile.mda_id) > 0) {
			return `${url}?mda_id=${this.userProfile.mda_id}`
		}
		return url;
	}

	//Get all reveue paid
	getAllRevenuePaid() {
		let url = this.parseUrl('tax_items/tax');
		this.dl.doGet(url).subscribe(
			(res) => {
				// console.log('This is the result',res)
			},
			(err) => {
				console.log(err);
			}
		);
	}

	revenueToday: any
	currentMonthRevenue: any

	getTodaysRevenue() {
		let url = this.parseUrl('/reports/revenue_today');
		this.dl.doGet(url).subscribe(
			(res:any) => {
				// console.log('This is the result',res)
				this.revenueToday = res.amount
			},
			(err) => {
				console.log(err);
			}
		);
	}

	getRevenueForCurrentMonth() {
		let url = this.parseUrl('/reports/current_month_revenue');
		console.log({url});
		
		this.dl.doGet(url).subscribe(
			(res:any) => {
				// console.log('This is the result',res)
				this.currentMonthRevenue = res.amount
			},
			(err) => {
				console.log(err);
			}
		);
	}

	getAssessmentsForToday() {
		this.loading = true;
		let completedUrl = this.parseUrl(`reports/assessments_today`);
		this.dl.doGet(completedUrl).subscribe(
			(res:any) => {
				// console.log('completedUrl',res)
				this.todayAssessmentsAmount= res.amount; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
	}	


	psirsTotalAmount:string ="";
	otherMdasTotalAmount:string="";
	psirsRevenuePercentage:number = 0;
	mdasRevenuePercentage:number =0;

	getPsirsVsOtherMdas(){
 
		let totalMdas:number = 0;

		
		this.filteredMdaAssessmentBreakdowns.forEach((mda:any)=>{
			console.log(mda);
			if(mda.mda_name.trim()!="PLATEAU STATE INTERNAL REVENUE SERVICE"){

				totalMdas+=Number(mda.total);
				this.mdasRevenuePercentage+=Number(mda.percentage);
			}
			else{

				this.psirsTotalAmount = mda.total;
				this.psirsRevenuePercentage= mda.percentage;
			}
		});

		this.otherMdasTotalAmount = ""+totalMdas; 

	}


	getTotalAssessmentAmount() {
		this.loading = true;
		let completedUrl = this.parseUrl(`payments/list_completed_for_user/${this.userProfile.id}`);
		this.dl.doGet(completedUrl).subscribe(
			(res:any) => {
				// console.log('completedUrl',res)
				this.totalAssessments = res.items_count; 
				this.totalPayments = res.total;
				this.loading = false; 
			},
			(err) => {
				console.log(err);
				this.loading = false; 
			}
		);
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

	filterByDate(resetPagination: boolean = false) {
		if (resetPagination) {
		  this.pagination.setCurrentPage(0);
		}
		this.loading = true;
		let url = `payments/filter_pending_for_user/${this.userProfile.id}?page=${this.pagination.currentPage}`;
	
		url = `${url}&to=${this.to}&from=${this.from}`;
		if (this.selectedMDA != null) {
		  	url = `${url}&mda_id=${this.selectedMDA}`;
		}
	
		if (this.searchField) {
		  	url = `${url}&search=${this.searchField}`;
		}
	
		this.dl.doGet(url).subscribe((res: any) => {
			// console.log("result filtering ", res);
			if (res.length < 1) {
			  	this.toastService.info("No payments found ", "Empty!", { timeOut: 3000 });
			}
			this.pagination.totalItemCount = res.items_count;
			this.assessments = res.list;
			this.filteredItems = [...this.assessments];
	
			this.paymentTotal = this.filteredItems.reduce(
			  	(acc, pmt) => acc + parseInt(pmt.amount),
			  	0
			);
			this.loading = false;
		},
		(err) => {
			this.loading = false;
		});
	}

}
