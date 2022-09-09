import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./previous-bulk-assessment.component.html",
  styleUrls: ["./previous-bulk-assessment.component.scss"],
  animations: [SharedAnimations],
})
export class PreviousPresumptiveTaxAssessmentComponent implements OnInit {
  mdas: any;
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  assessments: any;
  assessmentsForSelectedBulk: any;
  bulkPayeItems: any;

  filteredItems: any[] = [];
  filteredSelectedItems: any[] = [];

  searchControl: FormControl = new FormControl();

  @ViewChild("modalConfirm", { static: false }) private modalContent;
  @ViewChild("modalPaymentGateways", { static: false })
  private modalPaymentGateways;
  @ViewChild("modalBillingRef", { static: false }) private billingRef;

  userProfile: any;

  searching: boolean = false;

  bulkAssessmentTotal: number = 0;

  status: any;
  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private printpdfService: PrintpdfService,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.breadcrumb.setCrumbItem("assessmentHistory");

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });

    this.route.params.subscribe((params) => {
      this.status = params["status"];
      this.loadAssessments(); // reset and set based on new parameter this time
    });

    this.loadAssessments();
  }

  getCustomTaxItem(item) {
    if (item.length) {
      let desc = JSON.parse(item.rules);
      if (desc && desc.description) {
        return desc.description;
      }
    }

    return "PAYE";
  }

  getCustomTaxItemForDisplay(item) {
    console.log(item, "fetching");
  }

  print() {
    window.print();
  }

  loadAssessments() {
    this.loading = true;

    let url =
      "/assessment/list_bulk_presumptive_for_user/" + this.userProfile.id;

    if (this.status != undefined) {
      url = url + "/" + this.status;
    }

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res && res.length < 1) {
          this.toastr.info("No Assessments yet!", "Empty!", { timeOut: 3000 });
        }
        if (res) {
          this.assessments = res;
          this.filteredItems = [...this.assessments];
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  assessmentForDisplay: any = {};
  displayPayee: any;
  dynamicSummary: boolean = false;
  payeeSummary: boolean = false;
  directAssessmentSummary: boolean = false;

  viewAssessment(assessment: any) {
    this.assessmentForDisplay = Object.assign({}, assessment);
    this.assessmentForDisplay.status = assessment.status;
    this.assessmentForDisplay.bulk_name = assessment.bulk_name;
    this.assessmentForDisplay.tin =
      assessment.organization_tin || assessment.tin;
    this.assessmentForDisplay.name =
      assessment.organization_name || assessment.name;
    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
    this.calculateTotalForSelectedBulkAssessment(assessment.bulk_assessment_id);
  }

  goToViewAssessments(bulk_assessment_id: any, tin: any) {
    this.modalService.dismissAll();
    this.router.navigateByUrl(
      "assessment/view-bulk-presumptive-tax-assessments/" +
        bulk_assessment_id +
        "/" +
        tin +
        "/" +
        this.assessmentForDisplay.billing_ref
    );
  }

  monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  getDate(dateString: string) {
    const date = dateString.split("-");
    const year = date[0];
    const month = Number(date[1]);
    return ` ${this.monthNames[month - 1]}, ${year}`;
  }

  makePaymentForTaxItem() {
    const item = this.assessmentForDisplay;
    let amount = item.amount;
    if (item.mda_id == 3 && item.tax_item_id == 13) {
      amount = item.rules.tax;
    }
    let win: any = window;
    win.payWithPaystack(Math.ceil(amount), this);
  }

  printDoc(div) {
    this.printpdfService.printNoticeAssMent(div);
  }
  downloadDoc(div) {
    this.printpdfService.downloadAssessment(div);
  }

  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  formatNumber(x: number) {
    return x
      ? x
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : x;
  }

  window = window;

  calculateTotalForSelectedBulkAssessment(bulk_id: any) {
    console.log({ bulk_id });
    this.loading = true;
    this.bulkAssessmentTotal = 0;
    let url = "assessment/list_bulk_paye_assessments/" + bulk_id;
    if (this.status != undefined) {
      url = url + "/" + this.status;
    }

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res && res.length < 1) {
          this.toastr.info(
            "This bulk item has no individual assessments! ",
            "Empty!",
            { timeOut: 3000 }
          );
        }

        res &&
          res.forEach((item: any) => {
            let individual = JSON.parse(item.form_items);
            console.log({ individual });
            this.bulkAssessmentTotal += +individual.amount;
          });

        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
      }
    );
  }

  chosePaymentMethod() {
    this.modalService.open(this.modalPaymentGateways, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
  }

  payWithBillingRef() {
    this.loading = true;
    setTimeout(() => {
      this.toastr.error("Billing Ref not found", "Error!", { timeOut: 3000 });
      this.loading = false;
    }, 5000);
  }
}
