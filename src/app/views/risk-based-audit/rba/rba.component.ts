import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Utils } from "src/app/shared/utils";
import { fromEvent } from "rxjs";
import {
	filter,
	debounceTime,
	distinctUntilChanged,
	tap,
} from "rxjs/operators";

import { ActivatedRoute } from "@angular/router";
// import { ManageUserService } from "./manage-user.service";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { RiskBasedAuditService } from "./rba.service";

interface IActivityLog {
	sn?: number;
	id: number;
	user_id?: number;
	ip?: string;
	module: string;
	action: string;
	description?: string;
	user?: string;
	created_at?: string;
	updated_at?: string;
}
@Component({
	selector: "app-activity",
	templateUrl: "./rba.component.html",
	styleUrls: ["./rba.component.scss"],
	animations: [SharedAnimations],
})
export class ActivityComponent implements OnInit {
	activities: any[];
	loading: boolean = false;
	searchLoading: boolean = false;
	cache: Record<string, any> = {};

	userProfile: any;
	filteredItems: any[] = [];
	page: number = 1;
	offset: number = 0;
	nextPage: number;
	pageCount: number;
	perPageCount: number;
	previousPage: number;
	resultCount: number;
	pageNumber: number;
	totalCount: number;
	status: any;

	@ViewChild("input", { static: false }) input: ElementRef;

	constructor(
		private http: HttpService,
		private breadcrumb: BreadcrumbService,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private activityService: RiskBasedAuditService,
		private toastService: ToastrService
	) {}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");
		this.loadActivities();
		this.breadcrumb.setCrumbItem("rba");
	}

	calculateRisk() {
		this.loading = true;
		this.http.doGet("/risk_based_audit/generate_risk_base_audit").subscribe(
			(res: { message: string }) => {
				this.toastService.success(res.message);
				this.loadActivities();
				this.loading = false;
			},
			(err) => {
				this.toastService.error("An Error occurred!");
				this.loading = false;
			}
		);
	}

	ngAfterViewInit() {
		// server-side search
		fromEvent(this.input.nativeElement, "keyup")
			.pipe(
				filter(Boolean),
				debounceTime(1000),
				distinctUntilChanged(),
				tap(() => {
					this.loading = true;
					this.http
						.doGet(`audit/activities/?user=${this.input.nativeElement.value}`)
						.subscribe(
							(res: any) => {
								const loadedAct: any = res.data.result || [];
								this.activities = loadedAct.map((act, index) => ({
									...act,
									sn: ++index,
								}));
								this.loading = false;
							},
							(err) => {
								this.loading = false;
							}
						);
				})
			)
			.subscribe();
	}

	isInputDisplayed = false;
	displayInput() {
		this.isInputDisplayed = true;
	}

	submitInput() {
		this.isInputDisplayed = false;
	}

	loadActivities() {
		this.loading = true;
		this.http.doGet(`users/list_companies/1?sort_by_risk=1`).subscribe(
			(res: any) => {
				this.activities = res.data.result.map((coy, i) => ({
					...coy,
					sn: i + 1,
				}));
				this.activityService.activity.next(this.activities);
				this.nextPage = res.data.next_page;
				this.previousPage = res.data.previous_page;
				this.pageCount = res.data.page_count;
				this.perPageCount = res.data.per_page_count;
				this.resultCount = res.data.result_count;
				this.totalCount = res.data.total_count;
				this.loading = false;
			},
			(err) => {
				this.loading = false;
			}
		);
	}

	// onPageChange(pg: any) {
	//   // console.log(pg);
	//   if (this.offset == pg.offset) {
	//     return;
	//   }

	//   this.loading = true;

	//   this.offset = pg.offset;
	//   this.page = this.offset + 1;

	//   this.http.doGet(`audit/activities/${this.page}`).subscribe(
	//     (res: any) => {
	//       const acts: any = res.data.result || [];
	//       this.activities = acts.map((act, index) => ({ ...act, sn: ++index }));

	//       this.activityService.activity.next(this.activities);

	//       this.nextPage = res.data.next_page;
	//       this.previousPage = res.data.previous_page;
	//       this.pageCount = res.data.page_count;
	//       this.perPageCount = res.data.per_page_count;
	//       this.resultCount = res.data.result_count;
	//       this.totalCount = res.data.total_count;

	//       this.loading = false;
	//     },
	//     (err) => {
	//       this.loading = false;
	//     }
	//   );
	// }

	capitalise(words) {
		return words
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	timeAgo(timestamp: any) {
		const seconds = Math.floor(new Date(timestamp).getTime() / 1000);
		return Utils.getTimeIntervalPhpTimeStamp(seconds);
	}
}
