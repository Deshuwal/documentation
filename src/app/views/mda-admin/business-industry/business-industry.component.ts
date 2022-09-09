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
import { Router } from '@angular/router';

import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DropdownDataService } from 'src/app/shared/services/dropdown-data.service';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './business-industry.component.html',
  styleUrls: ['./business-industry.component.scss'],
  animations: [SharedAnimations],
})
export class BusinessIndustryComponent implements OnInit {
  
  loading: boolean = false;
  addUserLoading: boolean = false;
  
  addBusinessIndustryForm: FormGroup;
  
  currentJustify = 'fill';
  userProfile: any;
  status: any;
  constructor(
    private dl: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private router: Router,
    private breadcrumb: BreadcrumbService,
  ) {}

  ngOnInit() {
    this.addBusinessIndustryForm = this.fb.group({
      name: ["", Validators.required],
    });
    this.userProfile = this.localStore.getItem('user');
    this.breadcrumb.setCrumbItem('manageBusinessIndustries');
  }



  errMsg: any = {};

  saveBusinessIndustry() {
    this.loading = true;
    this.addUserLoading = true;
    
    this.dl.doPost('business/save_business_industry', this.addBusinessIndustryForm.value).subscribe(
      (res: any) => {
        this.successAddingCompany();
        this.router.navigateByUrl("/setup/manage_business_industries");
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
    this.toastr.success("Business Industry added Successfully!", "Success!", {
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
    });
  }

}
