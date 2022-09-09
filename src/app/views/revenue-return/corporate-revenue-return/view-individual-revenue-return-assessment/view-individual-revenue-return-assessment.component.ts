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
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Observable, forkJoin } from "rxjs";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./view-individual-revenue-return-assessment.component.html",
  styleUrls: ["./view-individual-revenue-return-assessment.component.scss"],
  animations: [SharedAnimations],
})
export class ViewIndividualRevenuReturnAssessmentComponent implements OnInit {
  mdas: any;
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
  companyTin: any;

  searching: boolean = false;

  status: any;
  bulkPayeId: any;
  billing_ref: any;

  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private printpdfService: PrintpdfService,
    private assessmentService: AssessmentService,
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.breadcrumb.setCrumbItem("assessmentHistory");

    this.route.params.forEach((e: any) => {
      if (e.bulkPayeId) this.bulkPayeId = e.bulkPayeId;
    });

    this.route.params.subscribe((params) => {
      // this.status = params["status"];
      this.bulkPayeId = params["bulk_paye_id"];
      this.companyTin = params["tin"];
      this.billing_ref = params["billing_ref"];
      this.loadAssessments(); // reset and set based on new parameter this time
    });

    console.log("param is ", this.bulkPayeId);

    //this.loadTaxItems();
    //this.loadMdas()
    this.loadAssessments();

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

  submitTaxItem() {
    if (
      this.taxItemForm.value.mda_id == null ||
      parseInt(this.taxItemForm.value.mda_id) < 1
    ) {
      return;
    }

    this.loading = true;

    console.log("submitting tax item ", this.taxItemForm.value);

    this.dl.doPost("/tax_items/save", this.taxItemForm.value).subscribe(
      (res) => {
        console.log("result saving", res);
        this.editMode = false;
        this.loading = false;
        this.loadTaxItems();
      },
      (error) => {
        this.loading = false;
        console.log("error saving tax item", error);
      }
    );
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

  downloadPDF(div) {
    this.printpdfService.downloadAssessment(div);
  }

  assessmentsCsv: any = [];
  assessmentsCsvTotal = {
    "Annual Gross Pay": 0,
    "Life Insurance": 0,
    Pension: 0,
    NHIS: 0,
    NHF: 0,
    CRA: 0,
    "Taxable Income": 0,
    "Annual Tax Liability": 0,
    "Monthly Tax Liability": 0,
    "Development Levy": 0,
    Total: 0,
  };

  companyDetail: any = {};
  updatedTotal = false;
  loadAssessments() {
    this.loading = true;

    let url: any = "/assessment/list_bulk_paye_assessments";
    if (this.bulkPayeId != undefined) {
      url = url + "/" + this.bulkPayeId;
    }

    url = this.dl.doGet(url);
    let companyDetails = this.dl.doGet(
      "/users/company_details/" + this.companyTin
    );

    // if (this.userProfile.role == "1") {
    //   url = "/assessment/list_bulk_paye_assessments";
    // }

    forkJoin([url, companyDetails]).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info("No Assessments yet!", "Empty!", { timeOut: 3000 });
        }

        this.assessments = res[0];
        this.companyDetail = res[1] && res[1].data[0];
        this.filteredItems = [...this.assessments];
        let mL = [
          "",
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

        this.assessmentsCsv = this.filteredItems
          .map((el) => {
            let jsonParseObj = {
              ...el,
              name: JSON.parse(el.form_items).name,
              ...JSON.parse(el.rules),
            };

            let date = jsonParseObj.period_from.split("-");
            let month = parseFloat(date[1]);

            if (!this.updatedTotal) {
              this.assessmentsCsvTotal["Annual Gross Pay"] +=
                jsonParseObj.gross_income;
              this.assessmentsCsvTotal["Life Insurance"] += jsonParseObj.li;
              this.assessmentsCsvTotal.Pension += jsonParseObj.pe;
              this.assessmentsCsvTotal.NHIS += jsonParseObj.nhis;
              this.assessmentsCsvTotal.NHF += jsonParseObj.nhs;
              this.assessmentsCsvTotal.CRA += jsonParseObj.cra;
              this.assessmentsCsvTotal["Taxable Income"] +=
                jsonParseObj.taxable_income;
              this.assessmentsCsvTotal["Annual Tax Liability"] +=
                jsonParseObj.tax;
              this.assessmentsCsvTotal["Monthly Tax Liability"] +=
                jsonParseObj.tax / 12;
              this.assessmentsCsvTotal["Development Levy"] +=
                jsonParseObj.dev_levy ? 300 : 0;
              this.assessmentsCsvTotal.Total +=
                jsonParseObj.tax + jsonParseObj.dev_levy;
            }

            return {
              // "company name": jsonParseObj.payer_name,
              "individual name": jsonParseObj.name,
              "Payer Tin": jsonParseObj.tin,
              // Period: `${mL[month]}, ${date[0]}`,
              "Annual Gross Pay": jsonParseObj.gross_income,
              "Life Insurance": jsonParseObj.li,
              Pension: jsonParseObj.pe,
              NHIS: jsonParseObj.nhis,
              NHF: jsonParseObj.nhs,
              CRA: jsonParseObj.cra,
              "Taxable Income": jsonParseObj.taxable_income,
              "Annual Tax Liability": jsonParseObj.tax,
              "Monthly Tax Liability": jsonParseObj.tax / 12,
              "Development Levy": jsonParseObj.dev_levy,
              Total: jsonParseObj.tax + jsonParseObj.dev_levy,
            };
          })
          .reverse();
        this.updatedTotal = true;

        this.loading = false;
      },
      (err) => {
        this.updatedTotal = false;
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  loadMdas() {
    this.loading = true;
    this.dl.doGet("/mdas/list").subscribe(
      (res) => {
        // console.log("fetched mda ", res);
        this.mdas = res;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        // console.log("error fetching mda", err);
      }
    );
  }

  deleteInvoice(id, modal) {
    this.loading = true;
    this.modalService
      .open(modal, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => {
          this.dl.doGet("/tax_items/delete/" + id).subscribe((res) => {
            this.loading = false;
            this.toastr.success("Tax Item Deleted!", "Success!", {
              timeOut: 3000,
            });
            this.loadTaxItems();
          });
        },
        (reason) => {
          this.loading = false;
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

      console.log("Display Payee", this.displayPayee);
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

      // console.log('Display direct assessment', this.displayPayee);

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

  makePaymentForTaxItem() {
    const item = this.assessmentForDisplay;

    let amount = item.amount;

    if (item.mda_id == 3 && item.tax_item_id == 13) {
      amount = item.rules.tax;
    }

    let win: any = window;
    win.payWithPaystack(Math.ceil(amount), this);
  }

  paymentSucceeded(res) {
    this.loading = true;
    let url: string = `assessment/update_assessment/${this.assessmentForDisplay.id}/1`;

    this.dl.doGet(url).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success("Success", "Payment Successful!", {
          timeOut: 10000,
          closeButton: true,
          progressBar: true,
        });
        this.modalService.dismissAll("dismiss");
        this.loadAssessments();
      },
      (err) => {
        this.loading = false;
        this.toastr.error("Failed!", "Payment Failed", {
          timeOut: 10000,
          closeButton: true,
          progressBar: true,
        });
        this.modalService.dismissAll("dismiss");
      }
    );
  }

  editTaxItem(taxItem: any = null) {
    if (taxItem) {
      this.editTitle = "Edit TaxItem";
      this.taxItemForm.setValue({
        id: taxItem.id,
        rules: taxItem.rules,
        title: taxItem.title,
        mda_id: taxItem.mda_id,
      });
    } else {
      this.editTitle = "Create TaxItem";
      this.taxItemForm.setValue({ title: "", mda_id: "", id: "", rules: "" });
    }

    this.editMode = true;
  }

  parsePhpDate(date: string) {
    return new Date(+date * 1000).toLocaleDateString();
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
