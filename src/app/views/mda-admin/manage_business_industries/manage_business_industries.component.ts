import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { HttpService } from "src/app/shared/services/http.service";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { Router } from "@angular/router";
@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./manage_business_industries.component.html",
	styleUrls: ["./manage_business_industries.component.scss"],
	animations: [SharedAnimations],
})
export class ManageBusinessIndustriesComponent implements OnInit {
	
	@ViewChild("modalConfirm", { static: false }) private modalContent;
	@ViewChild("input", { static: false }) input: ElementRef;

	userProfile: any;
	constructor(
		private dl: HttpService,
		private localStore: LocalStoreService,
		private breadcrumb: BreadcrumbService,
		private router: Router,
	) {}


	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");
		this.breadcrumb.setCrumbItem("manageBusinessIndustries");
		this.fetchCompanies();
	}

	searching: boolean = false;
	loading: boolean = false;

	closeResult = "";
	industries = [];

	fetchCompanies() {
		this.loading = true;
		let url = "/business/get_business_industries/";

		this.dl.doGet(url).subscribe(
			(res: any) => {
				this.industries = res
				this.loading = false;
			},
			(err) => {
				this.loading = false;
			}
		);
	}

	createIndustry() {
		this.router.navigateByUrl("/setup/create-business-industry");
	}

}
