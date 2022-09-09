import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import states from '../../../../assets/data/state.json';
import industries from "../../../../assets/data/industries.json";
import { Router } from '@angular/router';

import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DropdownDataService } from 'src/app/shared/services/dropdown-data.service';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './migrate-company.component.html',
  styleUrls: ['./migrate-company.component.scss'],
  animations: [SharedAnimations],
})
export class MigrateCompanyComponent implements OnInit {
  
  loading: boolean = false;
  addUserLoading: boolean = false;
  
  addCompanyForm: FormGroup;
  
  currentJustify = 'fill';
  
  countries: string[] = this.dropdownDataService.countries;  
  public industries: any = [];
  public states: string[] = this.dropdownDataService.states;
  public lgas: any[] = [];

  userProfile: any;

  config = {
    search: true,
    limitTo: 10,
    placeholder: "Select",
    noResultsFound: "No results!",
  };

  status: any;
  constructor(
    private dl: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    private dropdownDataService: DropdownDataService
  ) {}

  ngOnInit() {
    this.addCompanyForm = this.fb.group({
      company_name: ["", Validators.required],
      rc_no: [""],
      business_industry: ["", Validators.required],
      employee_count: ["", Validators.required],
      lga: ["", Validators.required],
      business_location: [""],
      state: ["", Validators.required],
      industry: ["", Validators.required],
      address: ["", Validators.required],
      website: [""],
      email: [""],
      tin: ["", Validators.required],
      office_number: ["", Validators.required],
    });

    this.userProfile = this.localStore.getItem('user');

    this.breadcrumb.setCrumbItem('dashboardMigrateCompany');

    this.fetchState();
    this.fetchIndustries();

  }

  fetchState() {
    const nigeriaStates = states.map((state) => state.state);
    this.states = nigeriaStates;
  }

  fetchIndustries() {
    this.industries = industries.map((industry) => industry);
  }

  getSelectedState() {    
    this.lgas = this.dropdownDataService.getSelectedLga(
      this.addCompanyForm.value.state
    );
  }

  errMsg: any = {};

  addCompany() {
    this.loading = true;
    this.addUserLoading = true;
    
    this.dl.doPost('users/admin_migrate_company', this.addCompanyForm.value).subscribe(
      (res: any) => {
        console.log('migrate company', res);        
        this.successAddingCompany();
        this.router.navigateByUrl("/setup/companies");
        this.loading = false;
        this.addUserLoading = false;
      },
      (err) => {
        this.dl.displayServerValidautionErrors(err);
        this.loading = false;
        this.addUserLoading = false;
      }
    );
  }

  successAddingCompany() {
    this.toastr.success("Company Migration  Successful!", "Success!", {
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
    });
  }

}
