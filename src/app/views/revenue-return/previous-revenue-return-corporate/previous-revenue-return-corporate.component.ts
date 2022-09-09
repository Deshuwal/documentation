import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { Page } from "src/app/shared/models/Page";
import {
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-previous-revenue-return-corporate',
  templateUrl: './previous-revenue-return-corporate.component.html',
  styleUrls: ['./previous-revenue-return-corporate.component.scss'],
  animations: [SharedAnimations],
})
export class PreviousRevenueReturnCorporateComponent implements OnInit {
  loading: boolean = false;
  assessments: any;

  pagination: Page = new Page();

  @ViewChild("modalConfirm", { static: false }) private modalContent;
  @ViewChild("xlsxtable", { static: false }) table: ElementRef;

  userProfile: any;
  filteredItems: any[] = [];
  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private breadcrumb: BreadcrumbService,
    private printPdf: PrintpdfService,
    private headTitle: Title
  ) {}

  setPage(info: any) {
    // console.log("clicked set page", info);
    this.pagination.setCurrentPage(info.offset);
    // console.log("pagination now at " + this.pagination.currentPage);
  }

  ngOnInit() {
    this.headTitle.setTitle("Payments");
    this.userProfile = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("previousCorporateRevenueReturn");
    this.loadAssessments();
  }

  downloadPDF(element) {
    this.printPdf.exportAsPDF(element, "payment");
  }

  printPDFS(element) {
    this.printPdf.printPdf(element);
  }

  /*getCustomTaxItem(item) {
    let desc = JSON.parse(item.rules);

    if (desc && desc.description) {
      return desc.description;
    }

    return "Unspecified";
  }*/

  print() {
    window.print();
  }

  excelArray: any = [];

  loadAssessments() {
    this.loading = true;

    let url = `/revenue_returns/get_revenue_returns_for_user_corporate?user_id=${this.userProfile.id}&role=${this.userProfile.role}`;
    if(this.userProfile.role == 3 && this.userProfile.mda_id != undefined) {
      url = `${url}?mda_id=${this.userProfile.mda_id}`;
    }
    
    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.data.length < 1) {
          this.toastr.info("No Pending Payments yet!", "Empty!", {
            timeOut: 3000,
          });
        }
        this.assessments = res.data;
        let forCSV: any = {};
        this.filteredItems = this.assessments.map((el) => ({
          ...el,
          description: el.rules && JSON.parse(el.rules).description,
        }));
        this.pagination.totalItemCount = res.items_count;
        this.filteredItems.forEach((el) => {
          const parseForm_items = el.form_items && JSON.parse(el.form_items);
          const parseRules = el.rules && JSON.parse(el.rules);

          const item = {
            billing_ref: el.billing_ref,
            tax_item: el.tax_item,
            name: el.name,
            tin: el.payer_tin,
            date: String(new Date(el.created_at * 1000))
              .split(" ")
              .splice(0, 4)
              .join(" "),
            amount:
              parseRules && Object.values(parseRules).length
                ? parseRules.tax
                : parseForm_items && Object.values(parseForm_items).length
                ? parseForm_items.amount
                : el.amount,
            status: el.status ? "Unpaid" : "Paid",
          };

          if (!forCSV[el.mda]) {
            let mdaName = el.mda;
            forCSV[mdaName] = [];
            forCSV[mdaName].push(item);
            return;
          }

          forCSV[el.mda].push(item);
        });
        const values: any = Object.values(forCSV);
        this.excelArray = values.flat();

        const billToPay = this.localStore.getItem("billToPay") || null;
        const viewToPay = billToPay
          ? res.filter((ass) => ass.billing_ref == billToPay)[0]
          : null;

        if (viewToPay) {
          this.viewAssessment(viewToPay);
          this.localStore.setItem("billToPay", null);
        }

        this.loading = false;
      },
      (err) => {
        this.loading = false;
        // console.log("error fetching tax items", err);
      }
    );
  }



  assessmentForDisplay: any = {};
  displayPayee: any;
  displayDirect: any;
  dynamicSummary: boolean = false;
  payeeSummary: boolean = false;
  directAssessmentSummary: boolean = false;

  viewAssessment(assessment: any) {
    this.payeeSummary = false;
    this.directAssessmentSummary = false;
    const display = assessment.display ? JSON.parse(assessment.display) : null;
    this.assessmentForDisplay = Object.assign(
      {},
      { ...assessment, ...display }
    );
    this.assessmentForDisplay.display =
      assessment.rules && JSON.parse(assessment.rules).description;
    // if assessment is payee or licence
    if (assessment.tax_item_id == 13) {
      this.dynamicSummary = true;
      this.payeeSummary = true;

      try {
        this.assessmentForDisplay.rules = JSON.parse(assessment.rules);
      } catch (e) {}

      this.assessmentForDisplay.form_items = JSON.parse(
        this.assessmentForDisplay.form_items
      );

      this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
        this.assessmentForDisplay.form_items,
        JSON.parse(assessment.rules)
      );

      this.displayPayee.name = assessment.payer_name || assessment.name;

      //if paye; show monthly liability
      //@Todo; change this to be divided by number of months in period.
      if (this.payeeSummary) {
        this.displayPayee.paye = Number(this.displayPayee.paye) / 12;
      }

      this.assessmentForDisplay.tin = assessment.payer_tin || assessment.tin;
      this.assessmentForDisplay.created_at = assessment.created_at;

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });
      return;
    } else if (
      assessment.rules &&
      assessment.rules.length < 3 &&
      assessment.tax_item_id == 14
    ) {
      this.displayPayee =
        this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
          JSON.parse(assessment.form_items)
        );

      this.displayDirect = {};
      this.displayPayee.forEach(
        (el) => (this.displayDirect[el.label] = el.value)
      );
      console.log({ displayDirect: this.displayDirect });

      this.dynamicSummary = true;
      this.directAssessmentSummary = true;

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });
      return;
    }

    this.dynamicSummary = false;
    this.assessmentForDisplay.billing_ref = assessment.billing_ref;
    this.assessmentForDisplay.payer_name =
      assessment.payer_name || assessment.name;
    this.assessmentForDisplay.id = assessment.id;

    this.assessmentForDisplay.mda = assessment.mda;

    //this.assessmentForDisplay.tax_item = assessment.display
      //? JSON.parse(assessment.display).tax_item
      //: assessment.tax_item
      //? assessment.tax_item
      //: this.getCustomTaxItem(assessment);
    this.assessmentForDisplay.tin = assessment.company_tin;
    this.assessmentForDisplay.amount = assessment.amount;

    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
    // console.log({ assessmentForDisplay: this.assessmentForDisplay });
  }

  openAssessment() {
    this.router.navigateByUrl("/assessment/perform");
  }

  formatNumber(x: number) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
  }

  BRNField: string;
  searchField: string;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  selectedMDA: any = null;
  paymentTotal: number = 0;
  from: string;
  to: string;


}

