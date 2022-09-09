import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
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
import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PayeeCalculator } from "src/app/shared/models/payee_calculator";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./demand-notice.component.html",
  styleUrls: ["./demand-notice.component.scss"],
  animations: [SharedAnimations],
})
export class DemandNoticeComponent implements OnInit {
  // mdas: any;
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  assessments: any;
  taxItems: any;

  filteredItems: any[] = [];

  searchControl: FormControl = new FormControl();

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  userProfile: any;

  searching: boolean = false;

  status: any;
  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.breadcrumb.setCrumbItem("demandNotices");

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });

    this.route.params.subscribe((params) => {
      this.status = params["status"];
      this.loadDemandNotices(); // reset and set based on new parameter this time
    });

    //this.loadTaxItems();
    //this.loadMdas()
    this.loadDemandNotices();

    this.taxItemForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      mda_id: ["", Validators.required],
      rules: [""],
    });

    this.searchControl.valueChanges.subscribe((value: string) => {
      console.log("Value changed ", value);

      //	if(this.searching) return;

      this.searching = true;

      setTimeout(() => {
        this.searching = false;
      }, 1000);

      if (value.length < 1) {
        this.filteredItems = [...this.assessments];
      } else {
        this.filteredItems = [];
        this.filteredItems = [...this.taxItems];
      }

      let newList: any[] = [];

      value = value.toLowerCase();

      this.filteredItems.forEach((e) => {
        console.log("E is ", e);
        if (
          (e.tax_item && e.tax_item.toLowerCase().indexOf(value) > -1) ||
          (e.mda && e.mda.toLowerCase().indexOf(value) > -1) ||
          (e.billing_ref && e.billing_ref.toLowerCase().indexOf(value) > -1)
        ) {
          newList.push(e);
        }
      });

      this.filteredItems = newList;
    });
  }

  getCustomTaxItem(item) {
    let desc = JSON.parse(item.rules);

    if (desc && desc.description) {
      return desc.description;
    }
    return "Unspecified";
  }

  loadTaxItems() {
    this.loading = true;
    this.dl.doGet("/tax_items/list").subscribe(
      (res) => {
        console.log("fetched taxitems ", res);
        this.taxItems = res;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  print() {
    window.print();
  }

  loadDemandNotices() {
    this.loading = true;

    // let url = "assessment/list_demand_notices_for_user/" + this.userProfile.id;
    let url = "assessment/list_demand_notices/";

    if (this.userProfile.role == "4") {
      url = "assessment/list_demand_notices";
    }

    if (this.status != undefined) {
      url = url + "/" + this.status;
    }

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info("No Assessments yet!", "Empty!", { timeOut: 3000 });
        }
        console.log("fetched assessmentsssss ", res);
        this.assessments = res;
        this.filteredItems = [...this.assessments];
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
    this.payeeSummary = false;
    this.directAssessmentSummary = false;

    this.assessmentForDisplay = Object.assign({}, assessment);
    this.assessmentForDisplay.status = assessment.status;
    this.assessmentForDisplay.tin = assessment.payer_tin || assessment.tin;
    this.assessmentForDisplay.name = assessment.payer_name || assessment.name;

    if (assessment.rules) {
      this.assessmentForDisplay.rules = JSON.parse(assessment.rules);
    }

    if (assessment.form_items) {
      this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);
    }

    //if assessment is payee or licence
    if (assessment.tax_item_id == 13) {
      this.dynamicSummary = true;
      this.payeeSummary = true;

      this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
        this.assessmentForDisplay.form_items,
        this.assessmentForDisplay.rules
      );

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });

      return;
    } else if (assessment.rules.length < 3 && assessment.tax_item_id == 14) {
      this.displayPayee =
        this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
          this.assessmentForDisplay.form_items
        );

      this.dynamicSummary = true;
      this.directAssessmentSummary = true;

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });

      console.log("Display direct assessment", this.displayPayee);

      return;
    }

    this.dynamicSummary = false;

    this.assessmentForDisplay.tax_item = assessment.display
      ? JSON.parse(assessment.display).tax_item
      : assessment.tax_item
      ? assessment.tax_item
      : this.getCustomTaxItem(assessment);
    this.assessmentForDisplay.amount = assessment.amount;

    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });

    console.log("Assessment for display", this.assessmentForDisplay);
  }

  generateDemandNotice() {
    const item = this.assessmentForDisplay;
    console.log("Notice Demanded", item);
    console.log("Notice Demanded", item);

    this.loading = true;
    let url: string = `assessment/update_demand_notice/${this.assessmentForDisplay.id}`;

    this.dl.doGet(url).subscribe(
      (res) => {
        this.loading = false;
        console.log("Generated Demand Notice", res);
        this.toastr.success("Success", "Demand Notice Generated Successful!", {
          timeOut: 10000,
          closeButton: true,
          progressBar: true,
        });
        this.modalService.dismissAll("dismiss");
        this.loadDemandNotices();
      },
      (err) => {
        console.log("error dey", err);
        this.loading = false;
        this.toastr.error("Failed!", "Failed to generate Demand Notice", {
          timeOut: 10000,
          closeButton: true,
          progressBar: true,
        });
        this.modalService.dismissAll("dismiss");
      }
    );
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
}
