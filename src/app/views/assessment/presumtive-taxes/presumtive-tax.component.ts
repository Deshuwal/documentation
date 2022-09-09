import { Component, OnInit, ViewChild, OnChanges } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Utils } from "src/app/shared/utils";
import { AssessmentService } from "src/app/shared/services/assessment.service";

import { Router } from "@angular/router";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./presumtive-tax.component.html",
  styleUrls: ["./presumtive-tax.component.scss"],
  animations: [SharedAnimations],
})
export class PresumtiveTaxComponent implements OnInit {
  mdas: any;
  presumtiveTaxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  taxItems: any;
  presumtiveTaxes: any;

  selectedItem: any;

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  selectedAction: any;

  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 200,
    placeholder: "Select...",
    noResultsFound: "No results found!",
  };

  roadTaxes: any = [
    "Private Vehicle",
    "Out Of Series Number Plates",
    "Fancy Number Plates",
    "Revalidation of old Number Plates (Private Vehicle)",
    "Revalidation of Commercial Vehicle Number Plates",
    "Government Fancy Number Plates",
    "Government Official Number Plates",
    "Motor Cycle",
    "Motor Dealers Number Plates",
    "Replacement of Missing Number Plates",
    "Change of Ownership",
    "Driver's Licence",
    "Roadside Parking Fees",
  ];

  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private assessmentService: AssessmentService,
    private localStore: LocalStoreService,
    private toastService: ToastrService,
    private router: Router,
    private printPDF: PrintpdfService
  ) {}

  userProfile: any;
  hideForm = false;
  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.presumtiveTaxItemForm = this.fb.group({
      tin_slug: [""],
      business_association: [""],
      business_category: [""],
      period_from: ["", Validators.required],
      period_to: ["", Validators.required],
      year: [""],
      amount: [""],
      dev_levy: [""],
    });

    this.loadUsersTin();
    this.loadBusinessCategories();
  }

  loadingTins = false;
  tins: any = [];
  businessCategories: any = [];

  loadUsersTin() {
    this.loadingTins = true;
    this.dl.doGet("users/user_related_tins").subscribe(
      (res: any) => {
        this.tins = [
          ...res.data,
          {
            tin: this.userProfile.id,
            company_name: this.userProfile.name.trim()
              ? this.userProfile.name.trim()
              : `${this.userProfile.first_name} ${this.userProfile.surname} (${this.userProfile.tin})`,
          },
        ];

        console.log({ tins: this.tins, userProfile: this.userProfile });
        this.loadingTins = false;
      },
      (err) => {
        this.loadingTins = false;
      }
    );
  }

  downloadPDF(div) {
    this.printPDF.exportAsPDF(div, "Presumptive-tax.pdf");
  }

  loadBusinessCategories() {
    this.loadingTins = true;
    this.dl.doGet("business/list").subscribe(
      (res: any) => {
        this.businessCategories = [
          ...res,
          {
            tin: this.userProfile.id,
            company_name: this.userProfile.name
              ? this.userProfile.name.trim()
                ? this.userProfile.name
                : `${this.userProfile.first_name} ${this.userProfile.surname}`
              : "",
          },
        ];
        this.loadingTins = false;
      },
      (err) => {
        this.loadingTins = false;
      }
    );
  }

  updateAssessment(status: number) {
    console.log("updating ", this.assessmentForDisplay.id);
    this.loading = true;

    this.dl
      .doGet(
        "assessment/update_assessment/" +
          this.assessmentForDisplay.id +
          "/" +
          status
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.toastService.success("Success", "Assessment Status Updated!", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });
          this.modalService.dismissAll("dismisse");
          this.router.navigateByUrl("/assessment/history");
        },
        (err) => {
          this.loading;
        }
      );
  }

  assessmentForDisplay: any = {};

  saveAssessment(assessment: any) {
    this.loading = true;

    this.assessmentForDisplay.mda = assessment.display.mda;
    this.assessmentForDisplay.tax_item = assessment.display.tax_item;
    this.assessmentForDisplay.tin = this.userProfile.tin;
    this.assessmentForDisplay.amount = assessment.display.amount;
    this.assessmentForDisplay.year = this.presumtiveTaxItemForm.value.year;
    assessment.rules = JSON.stringify(assessment.rules);
    assessment.form_items = JSON.stringify(this.presumtiveTaxItemForm.value);
    assessment.amount = assessment.display.amount;
      (assessment.display = JSON.stringify(assessment.display));
    console.log(" displaying assessment to save ", assessment);

    this.dl.doPost("/assessment/save", assessment).subscribe(
      (res: any) => {
        this.loading = false;
        this.assessmentForDisplay = res.data;
        this.assessmentForDisplay.period = `${assessment.period_from} - ${assessment.period_to}`;
        console.log(res, " displaying ", this.assessmentForDisplay);
        this.openConfirmModal();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  submitPresumtiveAssessment() {
    let assessment: any = {
      mda_id: 3,
      tax_item_id: 15,
      user_id: this.userProfile.id,
      payer_tin: this.presumtiveTaxItemForm.value.tin_slug.tin,
      form_items: this.presumtiveTaxItemForm.value,
      period_from: this.presumtiveTaxItemForm.value.period_from,
      period_to: this.presumtiveTaxItemForm.value.period_to,

      rules: {
        assessments: {
          year: this.presumtiveTaxItemForm.value.year,
          amount: this.presumtiveTaxItemForm.value.amount,
          dev_levy: this.presumtiveTaxItemForm.value.dev_levy ? 300 : 0,
        },
      },
      display: {
        mda: "PSIRS",
        tax_item:
          this.presumtiveTaxItemForm.value.business_category +
          ": " +
          this.presumtiveTaxItemForm.value.business_association,
        amount: this.presumtiveTaxItemForm.value.amount,
      },
    };

    this.saveAssessment(assessment);
  }

  goToPayment() {
    this.modalService.dismissAll();
    this.router.navigateByUrl("assessment/history");
  }

  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  closeModal() {
    this.modalService.dismissAll("dismissed");
    window.location.reload();
  }

  modal: NgbModal;

  openConfirmModal() {
    this.modalService
      .open(this.modalContent, { ariaLabelledBy: "Assessment Result" })
      .result.then(
        (result) => {
          this.modal = result;
          console.log(result);
        },
        (reason) => {
          console.log("Err!", reason);
        }
      );
  }
  formatNumber(x: number) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
  }
}
