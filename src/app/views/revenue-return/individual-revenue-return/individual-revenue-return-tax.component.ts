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
  selector: 'app-individual-revenue-returns',
  templateUrl: './individual-revenue-returns.component.html',
  styleUrls: ['./individual-revenue-returns.component.scss'],
  animations: [SharedAnimations],
})
export class IndividualRevenueReturnsComponent implements OnInit {
  public forms = ['A', 'B', 'C'];
  public loading = false;
  public submitted = false;
  public generating = false;
  public addingCar = false;
  public addingBusiness = false;
  public addingDomesticServant = false;
  public customMsg: string = "";

  public formA: FormGroup;
  public formA2: FormGroup;
  public formA3: FormGroup;
  public formA4: FormGroup;
  public formB: FormGroup;
  public formC: FormGroup;
  public formC1: FormGroup;
  public formC2: FormGroup;
  public formD: FormGroup;
  public preForm: FormGroup;
  public activeStage = 0;
  public activeSubA = 0;
  public progressBar = 15;

  public user: any;
  taxPayer: any;

  private allChildren: any = [];
  private allCars: any = [];
  private allBusiness: any = [];
  private allDomesticServant: any = [];

  private taxItem: any;
  private taxItemId = 19;

  selectedTIN:any

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
    this.breadcrumb.setCrumbItem('revenueReturnTax');
    this.route.queryParams.subscribe(params => {
      console.log('paraommmm', params);
      this.getTaxPayerInfo(params.payer_tin);
      this.selectedTIN = params;
      this.getTaxItemInfo();
    });
  
    this.preForm = this.fb.group({
      mda: [''],
      mda_id: [''],
      tax_item: [''],
      tax_item_id: [''],
      payer_tin: [''],
      payer_name: [''],
      payment_year: [this.previousYear, Validators.required],
    });

    this.formA = this.fb.group({
      title: ['', Validators.required],
      surname: ['', Validators.required],
      first_name: ['', Validators.required],
      middle_name: [''],
      dob: [this.user.dob, Validators.required],
      marital_status: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      nationality: ['', Validators.required],
      employment_status: ['', Validators.required],
      employer: [''],
      employer_address: [''],
      change: [''],
      arrival_date: [null],
      departure_date: [null],
      residential_address: ['', Validators.required],
    });

    // Spouse Form
    this.formA2 = this.fb.group({
      name: [''],
      dob: [''],
      spouse_employment_status: [''],
      employer: [''],
      employer_address: [''],
      income: [''],
    });

    // Child Form
    this.formA3 = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      establishment_address: ['', Validators.required],
      income: ['', Validators.required],
    });

    this.formB = this.fb.group({
      income_basic_salary: ['', Validators.required],
      income_housing: [''],
      income_transport: [''],
      income_all_brought_in_from_outside: [''],
      income_all_earned_aggregate: ['', Validators.required],
      income_others: [''],
      deduction_pension: ['', Validators.required],
      deduction_nhf: ['', Validators.required],
      deduction_nhis: [0],
      deduction_life_premium: [0],
      deduction_voluntary_contribution: [0],
      deduction_voluntary_contribution_percentage: [0],
      rents: [''],
      earned_dividends: [0],
      other_dividends: [0],
      gratuities: [0],
      interest: [0],
      payer_bvn: [this.user.bvn],
      period_from: [0],
      period_to: [0],
    });

    this.formC = this.fb.group({
      residence_status: ['', Validators.required],
      rent_paid: [''],
      rent_paid_by_employer: [''],
      owner: [''],
      owner_address: [''],
      accommodation_type: ['', Validators.required],
      accommodation_location: ['', Validators.required],
      deduction_paye_by_employer: [''],
      deduction_withholding: [''],
      rental_period_from: [''],
      rental_period_to: [''],
    });

    this.formC1 = this.fb.group({
      name_of_domestic_staff: [],
      address_of_domestic_staff: [''],
      salary_of_domestic_staff: ['']
    });

    this.formC2 = this.fb.group({
      purchase_date: [''],
      vehicle_brand: [''],
      vehicle_model: [''],
      make_year: [''],
    });
    
    this.formD = this.fb.group({
      name_of_business: [''],
      amount_made_from_business: [''],
      business_category: [''],
      business_type: [''],
    });

    let user = `${this.user.first_name} ${this.user.surname} ${this.user.other_names}`;

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
  }

  getTaxPayerInfo(taxPayerid) {
    this.loading = true;
    let url =  `users/get_user_or_company_by_tin/${taxPayerid}`;
    console.log('taxPayer_URL', url);
    
		this.http
			.doGet(url)
			.subscribe(
				(res: any) => {
          console.log('taxPayer', res.data);
          
					this.taxPayer = res.data;
					this.user = res.data;
					this.loading = false;
				},
				(err) => {
					this.loading = false;
				}
			);
  }

  getTaxItemInfo() {
    this.loading = true;
    this.http.doGet(`tax_items/${this.taxItemId}`).subscribe(
      (res: any) => {
        
        this.taxItem = res;
        
        const payer_name = `${this.user.first_name} ${this.user.surname} ${this.user.other_names}`;
        const payer_tin = this.user.tin;

        if (!res) {
          this.toastService.error('Tax item does not exist.', 'Not Found!');
        }

        if (!payer_tin) {
          this.toastService.error('No TIN Selected', 'No TIN!');
        }

        if (!payer_name) {
          this.toastService.error('No Payer Selected', 'No Payer!');
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

    if(stage == 3){
      this.progressBar = 75;
    }

  }

  generateAssessment() {

    if (!this.formC.valid) {
      this.submitted = true;
      return;
    }

    this.generating = true;
    console.log('generating', this.assessment);
    
    this.http.doPost('/assessment/save_individual_revenue_returns', this.assessment).subscribe(
      (response: any) => {
        this.loading = true;
        this.toastService.success('Your returns have been submitted successfuly', 'Successful!');
        this.router.navigateByUrl(`/revenue-returns/previous-revenue-returns`);
        
        // this.router.navigateByUrl(`/assessment/perform?view=${response.data.id}`);
      },
      (err: any) => {
        this.generating = false;
        this.toastService.error('Unexpected error. Please retry.', 'Error!');
        console.log('say error dey', err);
        
      },
      () => {
        this.generating = false;
      }
    );
  }

  submitPersonalForm(stage = null) {
    
    if(stage == null){
      this.progressBar = 50;
    }
  
    if (!stage) {
      this.activeStage = 2;
      this.activeSubA = 0;
      this.submitted = false;
      return;
    }

    const emp = this.formA.get("employer");
    const emp2 = this.formA2.get("employer");
    const emp2Incom = this.formA2.get("income");
    emp.clearValidators();
    emp.updateValueAndValidity();
    emp2.clearValidators();
    emp2.updateValueAndValidity();
    emp2Incom.clearValidators();
    emp2Incom.updateValueAndValidity();

    if (stage == 1 && !this.formA.valid) {
      this.submitted = true;
      return;
    }

    if(stage == 1){
      const empStatus = this.formA.value.employment_status;
      if(empStatus == 'Employed'){
        emp.setValidators([Validators.required]);
        emp.updateValueAndValidity();
        if (!this.formA.valid) {
          return;
        }
      }
    }

    if(stage == 2){
      const empStatus2 = this.formA2.value.spouse_employment_status;
      if(empStatus2 == 'Employed'){
        emp2.setValidators([Validators.required]);
        emp2.updateValueAndValidity();
        emp2Incom.setValidators([Validators.required]);
        emp2Incom.updateValueAndValidity();
        if (!this.formA2.valid) {
          this.submitted = true;
          return;
        }
      }
    }

    this.submitted = false;
    this.activeSubA = stage;
    
    if(this.activeSubA == 1){
      this.progressBar = 20;
    }else if(this.activeSubA == 2){
      this.progressBar = 25;
    }
  }


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

  addBusiness() {
    if (this.formD.valid) {
      this.allBusiness.push(this.formD.value);
      this.addingBusiness = false;
      return;
    }

    this.addingBusiness = true;
  }

  editBusiness(_index) {
    const bizz = this.allBusiness.find((_, index) => _index == index);
    this.formD.patchValue(bizz);
    this.removeBusiness(_index);
  }

  removeBusiness(_index) {
    this.allBusiness = this.allBusiness.filter((_, index) => index !== _index);
    this.addingBusiness = false;
  }

  addDomesticServant() {
    if (this.formC1.valid) {
      this.allDomesticServant.push(this.formC1.value);
      this.addingDomesticServant = false;
      return;
    }

    this.addingDomesticServant = true;
  }

  editDomesticServant(_index) {
    const servants = this.allDomesticServant.find((_, index) => _index == index);
    this.formC1.patchValue(servants);
    this.removeDomesticServant(_index);
  }

  removeDomesticServant(_index) {
    this.allDomesticServant = this.allDomesticServant.filter((_, index) => index !== _index);
    this.addingDomesticServant = false;
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
  get formd() {
    return this.formD.controls;
  }

  get formc1() {
    return this.formC1.controls;
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

  get businesses() {
    return this.allBusiness.map((item, index) => ({
      ...item,
      index,
      no: ++index,
    }));
  }

  get domesticservants() {
    return this.allDomesticServant.map((item, index) => ({
      ...item,
      index,
      no: ++index,
    }));
  }

  get assessment() {
    const {
      mda,
      tax_item,
      payment_year,
      ...rest
    } = this.preForm.value;

    const {
      name_of_business,
      amount_made_from_business,
      business_category,
      business_type,
    } = this.formD.value;

    let business_tax = 0;
    if(business_category != null && business_type != null){
      if(business_category.type != null){
        business_tax = this.selfAssService.calculatePersonalIncomeTax(business_category.type, business_type);
      }
    }
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
      businesses: this.allBusiness,
      servants: this.allDomesticServant,
      personal_data: this.formA.value,
      income_statement: this.formB.value,
      disclosure: this.formC.value
    }

    return {
      ...rest,
      amount,
      period_from,
      period_to,
      display: JSON.stringify(display),
      form_items: JSON.stringify(form_items),
      user_id: this.user.id,
      created_by: `${this.user.first_name} ${this.user.surname} ${this.user.other_names}`
    }
    
  }

  previous(stage){
    if(stage == 1){
      this.goToStage(stage);
      this.activeSubA = 0;
    }else if(stage == 2){
      this.submitPersonalForm(1);
    }else if(stage == 3){
      this.submitPersonalForm(2);
      this.activeStage = 1;
      this.activeSubA = 2;
    }else if(stage == 4){
      this.goToStage(3, this.formB);
      this.activeStage = 2;
    }
  }
}
