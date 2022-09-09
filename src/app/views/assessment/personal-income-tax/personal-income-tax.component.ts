import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { BusinessCategories, BusinessTypes } from 'src/app/shared/constants';
import { PayeeCalculator } from 'src/app/shared/models/payee_calculator';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DropdownDataService } from 'src/app/shared/services/dropdown-data.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { SelfAssessmentService } from 'src/app/shared/services/self-assessment.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-personal-income-tax',
  templateUrl: './personal-income-tax.component.html',
  styleUrls: ['./personal-income-tax.component.scss'],
  animations: [SharedAnimations],
})
export class PersonalIncomeTaxComponent implements OnInit {
  public forms = ['A', 'B', 'C'];
  public loading = false;
  public submitted = false;
  public generating = false;
  public addingCar = false;

  public formA: FormGroup;
  public formA2: FormGroup;
  public formA3: FormGroup;
  public formA4: FormGroup;
  public formB: FormGroup;
  public formC: FormGroup;
  public formC2: FormGroup;
  public preForm: FormGroup;
  public activeStage = 0;
  public activeSubA = 0;

  public user: any;

  private allChildren: any = [];
  private allCars: any = [];

  private taxItem: any;
  private taxItemId = 19;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService,
    private breadcrumb: BreadcrumbService,
    private localStore: LocalStoreService,
    private dropdownDataService: DropdownDataService,
    private selfAssService: SelfAssessmentService
  ) {}

  ngOnInit() {
    this.user = this.localStore.getItem('user');
    this.breadcrumb.setCrumbItem('personalIncomeTax');

    this.preForm = this.fb.group({
      mda: [''],
      mda_id: [''],
      tax_item: [''],
      tax_item_id: [''],
      payer_tin: [''],
      payer_name: [''],
      payment_year: [this.previousYear, Validators.required],
      business_category: ['', Validators.required],
      business_type: ['', Validators.required],
    });

    this.formA = this.fb.group({
      title: ['', Validators.required],
      surname: ['', Validators.required],
      first_name: ['', Validators.required],
      middle_name: [''],
      dob: ['', Validators.required],
      marital_status: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      nationality: ['', Validators.required],
      employer: ['', Validators.required],
      employer_address: ['', Validators.required],
      change: [''],
      arrival_date: [null],
      departure_date: [null],
      residential_address: [''],
    });

    this.formA2 = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      employer: ['', Validators.required],
      employer_address: ['', Validators.required],
      income: ['', Validators.required],
    });

    this.formA3 = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      establishment_address: ['', Validators.required],
      income: ['', Validators.required],
    });

    this.formB = this.fb.group({
      income_basic_salary: ['', Validators.required],
      income_housing: ['', Validators.required],
      income_transport: ['', Validators.required],
      income_all_brought_in_from_outside: ['', Validators.required],
      income_all_earned_aggregate: ['', Validators.required],
      income_others: ['', Validators.required],
      deduction_pension: [0],
      deduction_nhf: [0],
      deduction_nhis: [0],
      deduction_life_premium: [0],
      deduction_voluntary_contribution: [0],
      deduction_voluntary_contribution_percentage: [0],
      rents: ['', Validators.required],
      earned_dividends: [0],
      other_dividends: [0],
      gratuities: [0],
      interest: [0],
      payer_bvn: [this.user.bvn, Validators.required],
      period_from: [0],
      period_to: [0],
    });

    this.formC = this.fb.group({});

    this.formC = this.fb.group({
      residential_address: ['', Validators.required],
      address_change_count: ['', Validators.required],
      length_of_stay: ['', Validators.required],
      residence_status: ['', Validators.required],
      rent_paid: ['', Validators.required],
      rent_paid_by_employer: ['', Validators.required],
      rental_period: ['', Validators.required],
      owner: ['', Validators.required],
      owner_address: ['', Validators.required],
      accommodation_type: ['', Validators.required],
      accommodation_location: ['', Validators.required],
      name_of_domestic_staff: [],
      address_of_domestic_staff: [''],
      salary_of_domestic_staff: [''],
      deduction_paye_by_employer: [''],
      deduction_withholding: [''],
    });

    this.formC2 = this.fb.group({
      purchase_date: [''],
      vehicle_brand: ['', Validators.required],
      vehicle_model: ['', Validators.required],
      make_year: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      if (params.payer_tin && params.payer_name) {
        this.localStore.setItem('payer_tin', params.payer_tin);
        this.localStore.setItem('payer_name', params.payer_name);
        window.location.href = window.location.href.split('?')[0];
        window.location.reload();
      } else {
        this.getTaxItemInfo();
      }
    });
  }

  getTaxItemInfo() {
    this.loading = true;
    this.http.doGet(`tax_items/${this.taxItemId}`).subscribe(
      (res: any) => {
        this.taxItem = res;
        const payer_name = this.localStore.getItem('payer_name');
        const payer_tin = this.localStore.getItem('payer_tin');

        if (!res) {
          this.toastService.error('Tax item does not exist.', 'Not Found!');
          this.router.navigateByUrl('assessment/perform');
        }

        if (!payer_tin) {
          this.toastService.error('No TIN Selected', 'No TIN!');
          this.router.navigateByUrl('assessment/perform');
        }

        if (!payer_name) {
          this.toastService.error('No Payer Selected', 'No Payer!');
          this.router.navigateByUrl('assessment/perform');
        }

        this.preForm.patchValue({
          tax_item: this.taxItem.title,
          tax_item_id: this.taxItem.id,
          mda: this.taxItem.mda,
          mda_id: this.taxItem.mda_id,
          payer_tin,
          payer_name,
        });

        this.formA.patchValue({
          title: this.user.title_string || '',
          surname: this.user.surname || '',
          first_name: this.user.first_name || '',
          middle_name: this.user.other_names || '',
          dob: this.user.dob
            ? Utils.dateToNgbDate(new Date(this.user.dob))
            : '',
          marital_status: this.user.marital_status || '',
          email: this.user.email || '',
          phone: this.user.phone || '',
          address: this.user.payer_address || this.user.address || '',
          nationality: this.user.nationality || '',
        });

        this.loading = false;
      },
      (err: any) => {
        this.loading = false;
        this.toastService.error('Retrieving tax item failed.', 'Not Found!');
        this.router.navigateByUrl('assessment/perform');
      },
      () => {}
    );
  }

  goToStage(stage, formToValidate: FormGroup = null) {
    if (formToValidate && !formToValidate.valid) {
      this.submitted = true;
      return;
    }
    this.submitted = false;
    this.activeStage = stage;
  }

  generateAssessment() {
    if (!this.formC.valid) {
      this.submitted = true;
      return;
    }

    this.generating = true;

    this.http.doPost('/assessment/save', this.assessment).subscribe(
      (response: any) => {
        this.loading = true;
        this.toastService.success('Assessment Saved. Wait...', 'Successful!');
        this.router.navigateByUrl(`/assessment/perform?view=${response.data.id}`);
      },
      (err: any) => {
        this.generating = false;
        this.toastService.error('Unexpected error. Please retry.', 'Not Found!');
      },
      () => {
        this.generating = false;
      }
    );
  }

  submitPersonalForm(stage = null) {
    if (!stage) {
      this.activeStage = 2;
      this.activeSubA = 0;
      this.submitted = false;
      return;
    }

    if (stage == 1 && !this.formA.valid) {
      this.submitted = true;
      return;
    }

    if (
      stage == 2 &&
      this.formA.value.marital_status == 'married' &&
      !this.formA2.valid
    ) {
      this.submitted = true;
      return;
    }

    this.submitted = false;
    this.activeSubA = stage;
  }

  submitOtherIncome() {}

  submitPersonalPaye() {}

  addChild() {
    if (this.formA3.valid) {
      this.allChildren.push(this.formA3.value);
      this.formA3.patchValue({
        name: '',
        dob: '',
        establishment_address: '',
        income: '',
      });
      this.submitted = false;
      return;
    }

    this.submitted = true;
  }

  handleEditChild(_index) {
    const child = this.allChildren.find((_, index) => index === _index);
    this.formA3.patchValue({ ...child });
    this.handleRemoveChild(_index);
  }

  handleRemoveChild(_index) {
    this.allChildren = this.allChildren.filter((_, index) => index !== _index);
    this.submitted = false;
  }

  addCar() {
    if (this.formC2.valid) {
      this.allCars.push(this.formC2.value);
      this.addingCar = false;
      return;
    }

    this.addingCar = true;
  }

  editCar(_index) {
    const car = this.allCars.find((_, index) => _index == index);
    this.formC2.patchValue(car);
    this.removeCar(_index);
  }

  removeCar(_index) {
    this.allCars = this.allCars.filter((_, index) => index !== _index);
    this.addingCar = false;
  }

  get businesstypes() {
    return BusinessTypes;
  }

  get businesscategories() {
    return BusinessCategories;
  }

  get businessTypeConfig() {
    return {
      displayKey: 'description',
      search: true,
      moreText: 'See More',
      searchPlaceholder: 'Search Business Type',
      noResultsFound: 'Business Not Found... Type "Other Trades"',
      searchOnKey: 'description',
    };
  }

  get businessCategoryConfig() {
    return {
      displayKey: 'description',
      search: false,
      placeholder: 'Select Business Category',
    };
  }

  get preform() {
    return this.preForm.controls;
  }

  get forma() {
    return this.formA.controls;
  }

  get forma2() {
    return this.formA2.controls;
  }

  get forma3() {
    return this.formA3.controls;
  }

  get formb() {
    return this.formB.controls;
  }

  get formc() {
    return this.formC.controls;
  }

  get formc2() {
    return this.formC2.controls;
  }

  get countries() {
    return this.dropdownDataService.countries;
  }

  get titles() {
    return this.dropdownDataService.statuses;
  }

  get searchSelectConfig() {
    return {
      search: true,
      tabindex: 0,
      multiple: false,
    };
  }

  get selectConfig() {
    return {
      search: false,
      tabindex: 0,
      multiple: false,
    };
  }

  get paymentYear() {
    return this.preForm.value.payment_year;
  }

  get nextTxYear() {
    return parseInt(this.preForm.value.payment_year) + 1;
  }

  get year() {
    return new Date().getFullYear();
  }

  get previousYear() {
    return this.year - 1;
  }

  get children() {
    return this.allChildren.map((item, index) => ({
      ...item,
      dob: moment(item.dob).format('Do MMM, YYYY'),
      index,
      no: ++index,
    }));
  }

  get cars() {
    return this.allCars.map((item, index) => ({
      ...item,
      purchase_date: moment(item.purchase_date).format('Do MMM, YYYY'),
      index,
      no: ++index,
    }));
  }

  get assessment() {
    const {
      mda,
      tax_item,
      payment_year,
      business_category,
      business_type,
      ...rest
    } = this.preForm.value;

    const business_tax = this.selfAssService.calculatePersonalIncomeTax(
      business_category.type,
      business_type
    );

    const paye_tax: any =  (new PayeeCalculator()).CalculatePayee(this.formB.value);

    // const paye_tax = paye.tax;

    const deductions = this.selfAssService.calculateDeductions(
      this.formC.value
    );

    const amount = business_tax + paye_tax  - deductions;

    const display: any = {
      mda,
      tax_item,
      payment_year,
      business_tax,
      deductions,
      paye_tax,
      amount,
      business_category: business_category.type,
      business_type: business_type.description,
    };

    const period_from = moment(new Date(payment_year, 0, 1)).format('Do MMMM, YYYY');
    const period_to = moment(new Date(payment_year, 11, 31)).format('Do MMMM, YYYY');
    
    display.start = period_from;
    display.end = period_to;

    const form_items = {
      cars: this.allCars,
      spouse: this.formA2.value,
      children: this.allChildren,
      personal_data: this.formA.value,
      income_statement: this.formB.value,
      disclosure: this.formC.value,
    }

    return {
      ...rest,
      amount,
      period_from,
      period_to,
      display: JSON.stringify(display),
      form_items: JSON.stringify(form_items),
      user_id: this.user.id,
      created_by: this.user.name || `${this.user.first_name} ${this.user.surname}`
    }
  }
}
