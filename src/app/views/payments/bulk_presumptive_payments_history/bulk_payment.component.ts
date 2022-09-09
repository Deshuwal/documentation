import { Component, OnInit, ViewChild } from "@angular/core";
import { echartStyles } from "src/app/shared/echart-styles";
import { ProductService } from "src/app/shared/services/product.service";
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
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./bulk_payment.component.html",
  styleUrls: ["./bulk_payment.component.scss"],
  animations: [SharedAnimations],
})
export class PresumptiveBulkPaymentHistoryComponent implements OnInit {
  mdas: any;
  taxItemForm: FormGroup;
  gatewayForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  assessments: any;
  assessmentsForSelectedBulk: any;
  taxItems: any;
  bulkPayeItems: any;
  myAngularxQrCode = null;
  @ViewChild("modalConfirm", { static: false }) private modalContent;
  @ViewChild("modalPaymentGateways", { static: false })
  private modalPaymentGateways;
  @ViewChild("modalBillingRef", { static: false }) private billingRef;

  userProfile: any;

  searchControl: FormControl = new FormControl();
  filteredItems: any[] = [];
  filteredSelectedItems: any[] = [];
  bulkAssessmentTotal: number = 0;
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
    private breadcrumb: BreadcrumbService,
    private printPdf: PrintpdfService
  ) {}

  shouldVerifyPaymentStatus() {
    let url = window.location.href;

    return url.indexOf("verify") > 0;
  }

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.breadcrumb.setCrumbItem("presumptivePaymentHistory");

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });

    this.route.params.subscribe((params) => {
      this.status = params["status"];
      if (!this.shouldVerifyPaymentStatus() && this.status) {
        this.loadAssessments(); // reset and set based on new parameter this time
      }
    });

    var shouldVerifyPayment: boolean = this.shouldVerifyPaymentStatus();

    if (shouldVerifyPayment) {
      this.verifyPayment();
    } else {
      this.loadAssessments();
    }

    this.taxItemForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      mda_id: ["", Validators.required],
      rules: [""],
    });

    this.gatewayForm = this.fb.group({
      gateway: ["", Validators.required],
    });

    this.searchControl.valueChanges.subscribe((value: string) => {
      console.log("Value changed ", value);

      //	if(this.searching) return;

      if (value.length < 1) {
        this.filteredItems = [...this.assessments];
      } else {
        this.filteredItems = [];
        this.filteredItems = [...this.assessments];
      }

      let newList: any[] = [];

      value = value.toLowerCase();

      this.filteredItems.forEach((e) => {
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

    this.route.queryParams.subscribe((params) => {
      if (params.billing_ref) {
        this.localStore.setItem("billToPay", params.billing_ref);
        window.location.href = window.location.href.split("?")[0];
        window.location.reload();
      }
    });
  }

  downloadPDF(element) {
    this.printPdf.exportAsPDF(element, "payment");
  }

  printPDFS(element) {
    this.printPdf.printPdf(element);
  }

  getCustomTaxItem(item) {
    let desc = JSON.parse(item.rules);

    if (desc && desc.description) {
      return desc.description;
    }

    return "Unspecified";
  }

  verifyPayment() {
    let referenceNo = "";

    this.route.params.forEach((e: any) => {
      referenceNo = e.ref;
    });

    this.loading = true;

    let data: any = {};
    data.reference = referenceNo;

    this.toastr.info(
      "Verifying Payment for Billing Ref: " + data.reference,
      "Verifying Payment...",
      {
        timeOut: 3000,
      }
    );

    this.dl.doPostPaymentsServer("/opay/check_webpay_status", data).subscribe(
      (res: any) => {
        console.log("result verifying", data);
        if (res && res.data && res.data.status == "SUCCESS") {
          this.toastr.success(
            "Payment Completed! ",
            "Confirmed Payment for BRN: " + data.reference,
            {
              timeOut: 5000,
            }
          );

          this.router.navigateByUrl("payment/payment-history");
        } else {
          this.toastr.error("Please try again", "Payment Not Successful ", {
            timeOut: 5000,
          });

          this.router.navigateByUrl("payment/all");
        }
      },
      (error) => {
        this.loading = false;
        console.log("error saving tax item", error);

        this.toastr.error("Please try again", "Payment Not Successful ", {
          timeOut: 5000,
        });

        this.router.navigateByUrl("payment/all");
      }
    );
  }

  timeAgo(timestamp: number) {
    return Utils.getTimeIntervalPhpTimeStamp(timestamp);
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

  loadAssessments() {
    this.loading = true;

    let url =
      "/assessment/list_bulk_paye_for_user/" + this.userProfile.id + "/1";

    if (["1", "3", "4"].includes(this.userProfile.role)) {
      url = `/assessment/list_bulk_presumptive_for_user/${this.userProfile.id}/1`;
    }

    if(this.userProfile.role == 3 && this.userProfile.mda_id != undefined) {
      url = `${url}?mda_id=${this.userProfile.mda_id}`;
    }

    if (this.status != undefined) {
      url = url + "/" + this.status;
    }

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info("No Pending Payments yet!", "Empty!", {
            timeOut: 3000,
          });
        }
        this.assessments = res;
        this.filteredItems = this.assessments.map((ass) => ({
          ...ass,
          yearOfExpiry: new Date(ass.updated_at * 1000).getFullYear(),
        }));

        const billToPay = this.localStore.getItem("billToPay") || null;
        const viewToPay = billToPay
          ? res.filter((assessment) => assessment.billing_ref == billToPay)[0]
          : null;

        if (viewToPay) {
          this.viewAssessment(viewToPay);
          this.localStore.setItem("billToPay", null);
        }

        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  loadMdas() {
    this.loading = true;
    this.dl.doGet("/mdas/list").subscribe(
      (res) => {
        console.log("fetched mda ", res);
        this.mdas = res;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching mda", err);
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
  displayPayeeTotal: any;
  dynamicSummary: boolean = false;
  payeeSummary: boolean = false;
  directAssessmentSummary: boolean = false;

  viewAssessment(assessment: any) {
    this.payeeSummary = false;
    this.directAssessmentSummary = false;

    this.assessmentForDisplay = Object.assign({}, assessment);

    console.log("objectfff", assessment);

    //if assessment is payee or licence

    this.dynamicSummary = true;
    this.payeeSummary = true;

    this.assessmentForDisplay = Object.assign({}, assessment);
    this.assessmentForDisplay.status = assessment.status;
    this.assessmentForDisplay.bulk_name = assessment.bulk_name;
    this.assessmentForDisplay.tin =
      assessment.organization_tin || assessment.tin;
    this.assessmentForDisplay.name =
      assessment.organization_name || assessment.name;

    console.log("Display Payee", this.assessmentForDisplay);
    this.calculateTotalForSelectedBulkAssessment(assessment.id);
    this.myAngularxQrCode = `BRN: ${
      this.assessmentForDisplay.billing_ref
    } Payer Tin: ${
      this.assessmentForDisplay.payer_tin || this.assessmentForDisplay.tin
    }`;

    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });

    return;
    // }
  }
  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3,
    placeholder: "Select...",
    noResultsFound: "No results found!",
  };

  chosePaymentMethod() {
    this.modalService.open(this.modalPaymentGateways, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
  }

  getPaymentsReturnUrl(ref: string, orderNo: string = null) {
    let currentUrl = window.location.href.split("/payment")[0];

    return currentUrl + "/payment/verify/" + ref + "/" + orderNo;
  }

  makePaymentForTaxItem(itemId: number) {
    console.log("gotten id ", itemId);

    let item = this.getPaymentItem(itemId);
    let amount = 0;

    console.log(item);

    //dont remember why i'm checkign for a specific tax item here.
    if (item.mda_id == 3 && item.tax_item_id == 13) {
      amount = item.rules.tax;
    } else {
      amount = item.amount;
    }
    let win: any = window;
    this.pendingItem = item;
    console.log("gotten id ", amount);

    win.payWithPaystack(amount, this);
  }

  pendingItem: any;
  paymentSucceeded() {
    console.log("updating ", this.assessmentForDisplay.id);
    this.loading = true;

    let url: string = "/assessment/update_assessment/" + this.pendingItem.id;
    url = url + "/1" + "/" + this.gatewayForm.value.gateway;
    console.log("url is ", url);
    this.dl.doGet(url).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success("Success", "Payment Successful!", {
          timeOut: 10000,
          closeButton: true,
          progressBar: true,
        });
        this.modalService.dismissAll("dismiss");
        this.router.navigateByUrl("/assessment/history");
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

  openAssessment() {
    this.router.navigateByUrl("/assessment/perform");
  }

  getPaymentItem(id: number) {
    console.log("Getting assessment ", id, this.assessments);

    for (let i: number = 0; i < this.assessments.length; i++) {
      let thisId: number = parseInt(this.assessments[i].id);
      console.log("comparing ", thisId, id);
      if (thisId == id) {
        return this.assessments[i];
      }
    }

    return null;
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

  payBillingRef() {
    this.modalService.open(this.billingRef, {
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

  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  formatNumber(x: number) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
  }

  calculateTotalForSelectedBulkAssessment(bulk_id: any) {
    this.loading = true;

    let url = "assessment/list_bulk_paye_assessments/" + bulk_id;

    if (this.status != undefined) {
      url = url + "/" + this.status;
    }

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info(
            "This bulk item has no individual assessments! ",
            "Empty!",
            { timeOut: 3000 }
          );
        }

        res.forEach((item: any) => {
          let individual = JSON.parse(item.rules);
          this.bulkAssessmentTotal = +Number(individual.tax / 12).toFixed(2);
        });

        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
      }
    );
  }
}