import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
  FormGroupDirective,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd,
} from "@angular/router";
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";

export class MyErrorStateMatcher implements MyErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./register_account.component.html",
  styleUrls: ["./register_account.component.scss"],
  animations: [SharedAnimations],
})
export class RegisterVendorComponent implements OnInit {
  mdas: any;
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  assessments: any[];
  taxItems: any;

  @ViewChild("modalConfirm", { static: false }) private modalContent;

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

    this.breadcrumb.setCrumbItem('dashboardRegisterVendor');

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });

    this.route.params.subscribe((params) => {
      this.status = params["status"];
      this.loadAssessments(); // reset and set based on new parameter this time
    });

    console.log("param is ", this.status);

    //this.loadTaxItems();
    //this.loadMdas()
    this.loadAssessments();
  }

  timeAgo(timestamp: number) {
    return Utils.getTimeIntervalPhpTimeStamp(timestamp);
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const password = group.get("password").value;
    const confirmPassword = group.get("confirm_password").value;
    return password === confirmPassword ? null : { notSame: true };
  }
  closeResult = "";

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  print() {
    window.print();
  }

  loadAssessments() {
    this.loading = true;

    let url = "vendor/users/" + 1;

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info("No vendor found ", "Empty!", { timeOut: 3000 });
        }
        this.assessments = res.data.result.map((user, idx) => ({
          ...user,
          sn: idx + 1,
        }));
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

    console.log("view assessment ", assessment);

    //if assessment is payee or licence
    if (assessment.tax_item_id == 13) {
      console.log("displaying paye ", assessment.rules);

      try {
        assessment.rules = JSON.parse(assessment.rules);
      } catch (e) {}
      this.dynamicSummary = true;
      this.payeeSummary = true;
      this.assessmentForDisplay = Object.assign({}, assessment);
      this.assessmentForDisplay.form_items = JSON.parse(assessment.form_items);

      this.displayPayee = this.assessmentService.arrangePayeeFormDataForDisplay(
        this.assessmentForDisplay.form_items,
        assessment.rules
      );

      console.log("rules ", assessment.rules);

      this.assessmentForDisplay.tin = this.userProfile.tin;

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });

      console.log("Display Payee", this.displayPayee);
      return;
    } else if (assessment.rules.length < 3 && assessment.tax_item_id == 14) {
      this.displayPayee = this.assessmentService.arrangeDirectAssessmentFormDataForDisplay(
        JSON.parse(assessment.form_items)
      );
      console.log("displaying direct assessment ", this.displayPayee);
      this.dynamicSummary = true;
      this.directAssessmentSummary = true;

      this.displayPayee.push({
        label: "Billing Ref",
        value: assessment.billing_ref,
      });

      this.modalService.open(this.modalContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
      });
      return;
    }

    this.dynamicSummary = false;
    this.assessmentForDisplay.billing_ref = assessment.billing_ref;
    this.assessmentForDisplay.id = assessment.id;

    this.assessmentForDisplay.mda = assessment.mda;
    this.assessmentForDisplay.tax_item = assessment.display
      ? JSON.parse(assessment.display).tax_item
      : assessment.tax_item;
    this.assessmentForDisplay.tin = assessment.tin;
    this.assessmentForDisplay.amount = assessment.amount;

    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
  }

  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  formatNumber(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  capitalise(words) {
    return words
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
