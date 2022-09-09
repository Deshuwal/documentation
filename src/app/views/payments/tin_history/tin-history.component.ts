import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { PaymentReceiptComponent } from '../payment-receipt/payment-receipt.component';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./tin-history.component.html",
	styleUrls: ["./tin-history.component.scss"],
	animations: [SharedAnimations],
})
export class TINHistoryComponent implements OnInit {

	@ViewChild(PaymentReceiptComponent, { static: false }) private receiptComponent!: PaymentReceiptComponent;

	loading: boolean = false;
	assessments: any;
	taxItems: any;
	tinForm: FormGroup;

	userProfile: any;

	filteredItems: any[] = [];

	searchControl: FormControl = new FormControl();

	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService
	) {}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");

		this.breadcrumb.setCrumbItem("paymentHistory");

		this.tinForm = this.fb.group({
			tin: ["", Validators.required],
		});
	}

	timeAgo(timestamp: number) {
		return Utils.getTimeIntervalPhpTimeStamp(timestamp);
	}

	getCustomTaxItem(item: any) {
		let desc = null;

		try {
			desc = JSON.parse(item.rules);
		} catch (error) {
			desc = null;
		}

		if (desc && desc.description) {
			return desc.description;
		}

		return "Unspecified";
	}

	print() {
		window.print();
	}

	loadAssessments() {
		this.loading = true;
		let url = "assessment/list_tin_history/" + this.tinForm.value.tin;
		this.dl.doGet(url).subscribe(
			(res: any) => {
				if (res.length < 1) {
					this.toastr.info("No TIN history found ", "Empty!", {
						timeOut: 3000,
					});
				}
				console.log("tiiii", res);
				this.assessments = res;
				this.filteredItems = [...this.assessments];
				this.loading = false;
			},
			(err) => {
				this.loading = false;
				// console.log('emppppp', err)
			}
		);
	}

	assessmentForDisplay: any = {};
	displayPayee: any;
	dynamicSummary: boolean = false;
	payeeSummary: boolean = false;
	directAssessmentSummary: boolean = false;

	viewAssessment(assessment: any) {
		this.receiptComponent.setAssessmentView(assessment, this);
	}

	

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
	}
}
