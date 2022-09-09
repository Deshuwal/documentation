import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
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
  Router
} from "@angular/router";
import { concat, Observable, of, Subject } from "rxjs";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./mla.component.html",
  styleUrls: ["./mla.component.scss"],
  animations: [SharedAnimations],
})
export class MotorLicenseAuthority implements OnInit {
  
  taxItemForm: FormGroup;
  loading: boolean = false;
  vehicleRegistrationForm: FormGroup;
  chasisInputForm: FormGroup;

  selectedItem: any;

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  selectedAction: any;

  roadTaxes: any = [
    "Private Vehicle", // 0
    "Out Of Series Number Plates", // 1
    "Fancy Number Plates", // 2
    "Revalidation of old Number Plates (Private Vehicle)", //3
    "Revalidation of Commercial Vehicle Number Plates", // 4
    "Government Fancy Number Plates", // 5
    "Government Official Number Plates", //6
    "Motor Cycle", //7
    "Motor Dealers Number Plates", // 8
    "Replacement of Missing Number Plates", //9
    "Change of Ownership", //10
    "Driver's Licence", // 11
    "Roadside Parking Fees", // 12
    "Vehicle Registration", //13
    "Vehicle Renewal", //14
    "Learners Permit", //15
    "Others", //16
  ];

  vehicleValue: any = [
    "above 1 million",
    "below 1 million"
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
    // this.loadMdas();
    this.loadTins();
    this.userProfile = this.localStore.getItem("user");

    this.taxItemForm = this.fb.group({
      selectedItem: [],
      selectedCategory: [],
      selectedAction: [],
      tin_slug: [""],
      vehicle_chasis: [""],
      new_owner_tin: [""],
      description: [""],
      Oamount: [""],
      
    });

    this.vehicleRegistrationForm = new FormGroup({
      vehicle_chasis: new FormControl(''),
      gross_weight: new FormControl(''),
      seater_capacity: new FormControl(''),
      load_capacity: new FormControl(''),
      vehicle_type: new FormControl(''),
      vehicle_color: new FormControl(''),
      vehicle_name: new FormControl(''),
      vehicle_model: new FormControl(''),
      engine_capacity: new FormControl(''),
      license_type: new FormControl(''),
      with_or_without_plate: new FormControl(''),
      plate_no: new FormControl(''),
      vehicle_value: new FormControl(''),
      registration_date: new FormControl(''),
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
  newOwnermatchedTIN: any;

  onDropdownClick(item) {
    if (this.taxItemForm.value.tin_slug) {
      const matches = this.taxItemForm.value.tin_slug.match(/\((.*?)\)/);
      const matched = this.foundTins.find((el) => el.tin == matches[1]);
      console.log({ matched });
      this.matchedTIN = matched;
    }
  }
  

  onNewOwerDropdownClick(item) {
    if (this.taxItemForm.value.new_owner_tin) {
      const matches = this.taxItemForm.value.new_owner_tin.match(/\((.*?)\)/);
      const newOwnermatched = this.foundTins.find((el) => el.tin == matches[1]);
      console.log({ newOwnermatched });
      this.newOwnermatchedTIN = newOwnermatched;
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

  showVehicleRegistrationForm: boolean = false;
  showChasisInputForm: boolean = false;
  showOtherVehicleAssessment: boolean = false;

  itemSelected() {
    this.subMenu = [];
    this.actions = [];

    console.log("selected item ", this.taxItemForm.value.selectedItem);
    switch (this.taxItemForm.value.selectedItem) {
      case this.roadTaxes[0]:
        this.subMenu = this.assessmentService.priVehicleCategories;
        break;

      case this.roadTaxes[1]:
        this.subMenu = this.assessmentService.outOfSeriesNumberPlatesCategories;
        break;

      case this.roadTaxes[2]:
        this.subMenu = this.assessmentService.priVehicleCategories;
        break;

      case this.roadTaxes[3]:
        this.subMenu = this.assessmentService.priVehicleCategories;
        break;

      case this.roadTaxes[4]:
        this.subMenu = this.assessmentService.commercialVehicleCategories;
        break;

      case this.roadTaxes[5]:
        this.subMenu =
          this.assessmentService.governmentFancyNumberPlateCategories;
        break;

      case this.roadTaxes[6]:
        this.subMenu =
          this.assessmentService.governmentOfficialNumberPlateCategories;

        break;

      case this.roadTaxes[7]:
        this.subMenu = this.assessmentService.motorCycleCategories;

        break;

      case this.roadTaxes[8]:
        this.subMenu = this.assessmentService.motorDealersPlateCategories;
        break;

      case this.roadTaxes[9]:
        this.subMenu = this.assessmentService.missingNumberPlatesCategories;
        break;

      case this.roadTaxes[10]:
        // this.subMenu = this.assessmentService.changeOfOwnershipCategories;
        this.showChasisInputForm = true;
        this.showVehicleRegistrationForm = false;
        break;

      case this.roadTaxes[11]:
        this.subMenu = this.assessmentService.driverLicenceCategories;
        break;

      case this.roadTaxes[12]:
        this.subMenu = this.assessmentService.roadSideParkingFeesCategories;
        break;
      case this.roadTaxes[13]:
        this.showVehicleRegistrationForm = true;
        this.showChasisInputForm = false;
        break;
      case this.roadTaxes[14]:
        // console.log(this.roadTaxes[14]);
        // this.showChasisInputForm = true;
        this.showVehicleRegistrationForm = false;

      // L symbol = 750
      // permiit = 500
        break;
      case this.roadTaxes[15]:
        console.log(this.roadTaxes[15]);
        this.subMenu = this.assessmentService.learnersPermits;
        break;
      case this.roadTaxes[16]:
        // console.log(this.roadTaxes[14]);
        this.showChasisInputForm = false;
        this.showVehicleRegistrationForm = false;
        this.showOtherVehicleAssessment = true;
        break;
    }
  }


  action: any;

  actions: any = [];
  categorySelected() {
    let assService = this.assessmentService;

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
      case this.roadTaxes[15]:
        console.log("Learners permit");
        assService.learnersPermitRules.forEach((rule: any) => {
          console.log("Rule: ", rule.tag);
          console.log('Selected Fee: ', rule.fees);
          console.log("Learners Selected item: " ,this.taxItemForm.value.selectedCategory);
          console.log('first', rule.tag == this.taxItemForm.value.selectedCategory);
          if (rule.tag == this.taxItemForm.value.selectedCategory) {
            this.actions = rule.fees;
          }
        });
        break;
    }
  }

  assessmentForDisplay: any = {};
  showAssessmentSuccessModal: boolean = false;
  
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
        // console.log(res, " displaying ", this.assessmentForDisplay);

        this.openConfirmModal();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  showPlateNumberInput:boolean = false;

  onPlateNumberSelectOptionChange($event) {
    let option = this.vehicleRegistrationForm.value.with_or_without_plate;
    option == 'yes' ? this.showPlateNumberInput = true : this.showPlateNumberInput = false;
  }

  showSubmittedVehicleRegistrationModal:boolean = false;
  submitVehicleRegistration() { 
    this.loading = true;
    let data: any = {
      user_id: this.userProfile.id,
      user_tin: this.matchedTIN.tin, //this.taxItemForm.value.tin_slug, //this.userProfile.tin,
      ...this.vehicleRegistrationForm.value,
      registered_by: this.userProfile.name,
      vehicle_owner: this.matchedTIN.payer_name,
      vehicle_owner_id: this.matchedTIN.id
    }; 

    this.dl.doPost("vehicle/save", data).subscribe(
      (res: any) => {
        if (!res.status) {
          this.loading = false;
          return this.toastr.error(res.reason, "An Error occurred!");
        }
        this.toastr.success("Vehicle registered successfully", "Success!");
        this.loading = false;
        this.showSubmittedVehicleRegistrationModal = true;
      },
      (err) => {
        this.loading = false;
      }
    );
    
  }

  isSearching:boolean  = false;
  showValidateButton:boolean = true;
  vehicleDetails: any = {};
  showVehicleRenewalForm: boolean = false

  validateVehicleRegistration() {
    this.loading = true;
    this.isSearching = true;

    console.log('chasis', this.taxItemForm.value.vehicle_chasis);
    let vehicle_chasis = this.taxItemForm.value.vehicle_chasis
    this.dl
      .doGet(`vehicle/validate/${vehicle_chasis}`)
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.isSearching = false;
          this.showValidateButton = false;
          res.data.vehicle_chasis ? this.showVehicleRenewalForm = true : this.showVehicleRenewalForm = false;
          this.vehicleDetails = res.data;
          // console.log(res.data);
          this.modalService.open(this.modalContent, {
            ariaLabelledBy: "modal-basic-title",
            centered: true,
          });
        },
        (err) => {
          this.loading = false;
          this.isSearching = false;
          this.showValidateButton = true;
          // console.log('error', err);
          this.toastr.error(
            "An error occured... Please verify that the Vehicle Chasis Number is correct"
          );
        }
      );
  }

  generateVehicleRenewal() {
    let data = this.vehicleDetails;
    const aboveOneMill = 6250;
    const belowOneMill = 3125;
    let amount = data.vehicle_value.toLowerCase() == this.vehicleValue[0] ? aboveOneMill : belowOneMill;

    let assessment: any = {
      mda_id: 3,
      tax_item_id: 16,
      user_id: this.userProfile.id,
      payer_tin: this.userProfile.tin,
      payer_name: this.userProfile.name,
      form_items: data,
      amount: amount,
      rules: [],
      display: {
        mda: "PSIRS",
        tax_item: this.taxItemForm.value.selectedItem,
        amount: amount,
      },
    };

    this.saveAssessment(assessment);
  }
  
  saveChangeOfOwnership() {
    let data = this.vehicleDetails;
    data.newOwner = this.newOwnermatchedTIN
    const aboveOneMill = 6250;
    const belowOneMill = 3125;
    let amount = data.vehicle_value.toLowerCase() == this.vehicleValue[0] ? aboveOneMill : belowOneMill;

    let assessment: any = {
      mda_id: 3,
      tax_item_id: 16,
      user_id: this.newOwnermatchedTIN.id,
      payer_tin: this.newOwnermatchedTIN.tin,
      payer_name: this.newOwnermatchedTIN.name,
      form_items: data,
      amount: amount,
      rules: [],
      display: {
        mda: "PSIRS",
        tax_item: this.taxItemForm.value.selectedItem,
        amount: amount,
      },
    };
    console.log('change of owner', assessment);
    this.saveAssessment(assessment);
  }

  submitVehicleAssessment() {
    let result = 0;

    let assService: any = this.assessmentService;
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
      case this.roadTaxes[15]:
        rules = assService.learnersPermitRules;
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

    let tax_item = this.showOtherVehicleAssessment ? this.taxItemForm.value.description :  this.selectedAction;
    let assessmentAmount = this.showOtherVehicleAssessment ? this.taxItemForm.value.Oamount : result;
    let formItems = this.taxItemForm.value;
    formItems.amount = assessmentAmount

    let assessment: any = {
      mda_id: 3,
      tax_item_id: 16,
      user_id: this.userProfile.id,
      payer_tin: this.matchedTIN.tin,
      payer_name: this.matchedTIN.payer_name,
      form_items: formItems,
      amount: assessmentAmount,
      description: this.taxItemForm.value.description,
      rules: [],
      display: {
        mda: "PSIRS",
        tax_item:
          // this.taxItemForm.value.selectedItem + ": " + this.selectedAction,
          this.taxItemForm.value.selectedItem + ": " + tax_item,
        amount: assessmentAmount,
      },
      created_by: this.userProfile.first_name + " " + this.userProfile.surname
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
