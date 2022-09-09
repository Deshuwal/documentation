import { Component, OnInit, ViewChild } from "@angular/core";
import { echartStyles } from "src/app/shared/echart-styles";
import { ProductService } from "src/app/shared/services/product.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
  filter,
} from "rxjs/operators";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Utils } from "src/app/shared/utils";
import { AssessmentService } from "src/app/shared/services/assessment.service";

import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd,
} from "@angular/router";
import { concat, Observable, of, Subject } from "rxjs";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./road-tax.component.html",
  styleUrls: ["./road-tax.component.scss"],
  animations: [SharedAnimations],
})
export class RoadTaxComponent implements OnInit {
  mdas: any;
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  editTitle: string = "";
  taxItems: any;

  selectedItem: any;

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  selectedAction: any;

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
    private assessmetnService: AssessmentService,
    private localStore: LocalStoreService,
    private toastService: ToastrService,
    private router: Router,
    private printPDF: PrintpdfService
  ) {}

  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 50,
    moreText: "More",
    searchPlaceholder: "Search by TIN.",
    noResultsFound: "No results found!",
    searchOnKey: "tin",
  };

  userProfile: any;
  currentTin: any;

  ngOnInit() {
    this.loadMdas();
    this.loadTins();
    this.userProfile = this.localStore.getItem("user");

    this.taxItemForm = this.fb.group({
      selectedItem: [],
      selectedCategory: [],
      selectedAction: [],
      tin_slug: [""],
    });
  }

  foundTIN$: Observable<any>;
  companiesLoading = false;
  companiesInput$ = new Subject<string>();
  minLengthTerm = 3;
  foundTins = [];

  loadTins() {
    this.foundTIN$ = concat(
      of([]), // default items
      this.companiesInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => (this.companiesLoading = true)),
        switchMap((term) => {
          return this.getCompanies(term).pipe(
            map(({ data }) => {
              const response = data.map((data: any) => {
                if (data.first_name && data.surname) {
                  return {
                    ...data,
                    payer_name: `${data.first_name}  ${data.surname}`,
                    name: `${data.first_name}  ${data.surname} (${data.tin})`,
                  };
                } else {
                  return {
                    ...data,
                    payer_name: data.name,
                    name: `${data.name} (${data.tin})`,
                  };
                }
              });

              this.foundTins = response;
              return response;
            }),
            catchError(() => of([])), // empty list on error
            tap(() => (this.companiesLoading = false))
          );
        })
      )
    );
  }

  getCompanies(term: string = null): Observable<any> {
    return this.dl.doGet("/users/search_tins?tin=" + term);
  }

  matchedTIN: any;
  onDropdownClick(item) {
    if (this.taxItemForm.value.tin_slug) {
      const matches = this.taxItemForm.value.tin_slug.match(/\((.*?)\)/);
      const matched = this.foundTins.find((el) => el.tin == matches[1]);
      console.log({ matched });
      this.matchedTIN = matched;
    }
  }

  exportAsPDF(div_id) {
    this.printPDF.downloadAssessment(div_id, "tax-assessment.pdf");
  }

  printPDFS(div) {
    this.printPDF.printPdf(div);
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

          this.router.navigateByUrl("/dashboard/assessment/history");
        },
        (err) => {
          this.loading;
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

  subMenu: any = [];
  privateVehicleActions: any = [
    "Vehicle Registration",
    "Plate Number Registration",
    "Vehicle Licence",
    "Registration Book",
  ];

  vehicleCategories: any = [
    { label: "Category A", tag: "a" },
    { label: "Category B", tag: "b" },
    { label: "Category C", tag: "c" },
    { label: "Category D", tag: "d" },
  ];

  itemSelected() {
    this.subMenu = [];
    this.actions = [];

    console.log("selected item ", this.taxItemForm.value.selectedItem);
    switch (this.taxItemForm.value.selectedItem) {
      case this.roadTaxes[0]:
        this.subMenu = this.assessmetnService.priVehicleCategories;
        break;

      case this.roadTaxes[1]:
        this.subMenu = this.assessmetnService.outOfSeriesNumberPlatesCategories;
        break;

      case this.roadTaxes[2]:
        this.subMenu = this.assessmetnService.priVehicleCategories;
        break;

      case this.roadTaxes[3]:
        this.subMenu = this.assessmetnService.priVehicleCategories;
        break;

      case this.roadTaxes[4]:
        this.subMenu = this.assessmetnService.commercialVehicleCategories;
        break;

      case this.roadTaxes[5]:
        this.subMenu =
          this.assessmetnService.governmentFancyNumberPlateCategories;
        break;

      case this.roadTaxes[6]:
        this.subMenu =
          this.assessmetnService.governmentOfficialNumberPlateCategories;

        break;

      case this.roadTaxes[7]:
        this.subMenu = this.assessmetnService.motorCycleCategories;

        break;

      case this.roadTaxes[8]:
        this.subMenu = this.assessmetnService.motorDealersPlateCategories;
        break;

      case this.roadTaxes[9]:
        this.subMenu = this.assessmetnService.missingNumberPlatesCategories;
        break;

      case this.roadTaxes[10]:
        this.subMenu = this.assessmetnService.changeOfOwnershipCategories;
        break;

      case this.roadTaxes[11]:
        this.subMenu = this.assessmetnService.driverLicenceCategories;
        break;

      case this.roadTaxes[12]:
        this.subMenu = this.assessmetnService.roadSideParkingFeesCategories;
        break;
    }
  }

  action: any;

  actions: any = [];
  categorySelected() {
    let assService = this.assessmetnService;

    console.log(this.taxItemForm.value.selectedCategory);

    switch (this.taxItemForm.value.selectedItem) {
      case this.roadTaxes[0]:
        console.log("private");
        assService.privateVehicleRules.forEach((rule: any) => {
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });

        break;

      case this.roadTaxes[1]:
        console.log("out of series ");
        assService.outOfSeriesPlateNumberRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[2]:
        console.log("out of series ");
        assService.fancyPlateNumberRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[3]:
        console.log("out of series ");
        assService.revalidationOldNumberPlatePrivateRules.forEach(
          (rule: any) => {
            console.log(
              "rule tag",
              rule.tag,
              " cateogyr ",
              this.taxItemForm.value.selectedCategory
            );
            if (rule.tag == this.taxItemForm.value.selectedCategory) {
              this.actions = rule.fees;
            }
          }
        );
        break;

      case this.roadTaxes[4]:
        console.log("out of series ");
        assService.revalidationOldNumberPlateCommercialRules.forEach(
          (rule: any) => {
            console.log(
              "rule tag",
              rule.tag,
              " cateogyr ",
              this.taxItemForm.value.selectedCategory
            );
            if (rule.tag == this.taxItemForm.value.selectedCategory) {
              this.actions = rule.fees;
            }
          }
        );
        break;

      case this.roadTaxes[5]:
        console.log("out of series ");
        assService.governmentFancyPlateRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[6]:
        console.log("out of series ");
        assService.governmentOfficialPlateNumberRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[7]:
        console.log("out of series ");
        assService.privateMotorCycleRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[8]:
        console.log("out of series ");
        assService.mortorDealersPlateRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[9]:
        console.log("out of series ");
        assService.missingPlateNumberRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[10]:
        console.log("out of series ");
        assService.changeOfOwnershipRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });

        break;

      case this.roadTaxes[11]:
        console.log("out of series ");
        assService.driverLicenseRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;

      case this.roadTaxes[12]:
        console.log("out of series ");
        assService.roadSideParkingRules.forEach((rule: any) => {
          console.log(
            "rule tag",
            rule.tag,
            " cateogyr ",
            this.taxItemForm.value.selectedCategory
          );
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;
    }
  }

  assessmentForDisplay: any = {};
  saveAssessment(assessment: any) {
    this.loading = true;

    this.assessmentForDisplay.mda = assessment.display.mda;
    this.assessmentForDisplay.tax_item = assessment.display.tax_item;
    this.assessmentForDisplay.amount = assessment.display.amount;

    assessment.rules = JSON.stringify(assessment.rules);
    assessment.form_items = JSON.stringify(this.taxItemForm.value);
    assessment.amount = assessment.display.amount;
    assessment.display = JSON.stringify(assessment.display);
    assessment.payer_name = this.matchedTIN.payer_name;
    assessment.payer_tin = this.matchedTIN.tin;
    assessment.created_by = `${this.userProfile.first_name} ${this.userProfile.surname}`;
    console.log({ assessment });

    this.dl.doPost("/assessment/save", assessment).subscribe(
      (res: any) => {
        if (!res.status)
          return this.toastr.error(res.reason, "An Error occurred!");
        this.loading = false;
        this.assessmentForDisplay.billing_ref = res.data.billing_ref;
        this.assessmentForDisplay.payer_name = res.data.payer_name;
        this.assessmentForDisplay.payer_tin = res.data.payer_tin;
        this.assessmentForDisplay.id = res.data.id;
        console.log(res, " displaying ", this.assessmentForDisplay);

        this.openConfirmModal();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  submitVehicleAssessment() {
    let result = 0;

    let assService: any = this.assessmetnService;
    let rules: any = [];

    switch (this.taxItemForm.value.selectedItem) {
      case this.roadTaxes[0]:
        rules = assService.privateVehicleRules;
        break;

      case this.roadTaxes[1]:
        rules = assService.outOfSeriesPlateNumberRules;
        break;

      case this.roadTaxes[2]:
        rules = assService.fancyPlateNumberRules;
        break;

      case this.roadTaxes[3]:
        rules = assService.revalidationOldNumberPlatePrivateRules;
        break;

      case this.roadTaxes[4]:
        rules = assService.revalidationOldNumberPlateCommercialRules;
        break;

      case this.roadTaxes[6]:
        rules = assService.governmentOfficialPlateNumberRules;
        break;

      case this.roadTaxes[5]:
        rules = assService.governmentFancyPlateRules;
        break;

      case this.roadTaxes[7]:
        rules = assService.privateMotorCycleRules;
        break;

      case this.roadTaxes[8]:
        rules = assService.mortorDealersPlateRules;
        break;

      case this.roadTaxes[9]:
        rules = assService.revalidationOldNumberPlatePrivateRules;
        break;

      case this.roadTaxes[10]:
        rules = assService.changeOfOwnershipRules;
        break;

      case this.roadTaxes[11]:
        rules = assService.driverLicenseRules;
        break;

      case this.roadTaxes[12]:
        rules = assService.roadSideParkingRules;
        break;
    }

    console.log("gotten rules ", rules);
    rules.forEach((rule: any) => {
      if (rule.tag == this.taxItemForm.value.selectedCategory) {
        rule.fees.forEach((fee: any) => {
          console.log(
            "checking ",
            fee.tag,
            this.taxItemForm.value.selectedAction
          );
          if (fee.tag == this.taxItemForm.value.selectedAction) {
            this.selectedAction = fee.label;
            result = fee.amount;
          }
        });
      }
    });

    let assessment: any = {
      mda_id: 3,
      tax_item_id: 16,
      user_id: this.userProfile.id,
      payer_tin: this.userProfile.tin,
      form_items: this.taxItemForm.value,
      rules: [],
      display: {
        mda: "PSIRS",
        tax_item:
          this.taxItemForm.value.selectedItem + ": " + this.selectedAction,
        amount: result,
      },
    };

    this.saveAssessment(assessment);
  }

  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  closeModal() {
    this.modalService.dismissAll("dismissed");
    window.location.reload();
  }

  goToPayment() {
    this.modalService.dismissAll();
    this.router.navigateByUrl("assessment/history");
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
}
