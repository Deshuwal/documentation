import * as XLSX from "xlsx";
import { Component, OnInit } from "@angular/core";
import { TinService } from "src/app/shared/services/tinservice";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { Router } from "@angular/router";

interface ICompany {
  company_name: string;
  rc_no: string;
  business_industry: string;
  lga: string;
  state: string;
  address: string;
  employee_count: Number;
  tin?: number;
  website?: string;
  office_email?: string;
  office_number?: string;
}

export interface IExcelCompany {
  ADDRESS_REQUIRED: string;
  COMPANY_NAME_REQUIRED: string;
  EMPLOYEE_COUNT_REQUIRED: number;
  INDUSTRY_REQUIRED: string;
  LGA_REQUIRED: string;
  RC_NO_REQUIRED: string;
  STATE_REQUIRED: string;
  EMAIL_OPTIONAL: string;
  OFFICE_NUMBER_OPTIONAL: string;
  TIN_OPTIONAL: number;
  WEBSITE_OPTIONAL: string;
}

@Component({
  selector: "register-company-bulk",
  templateUrl: "./register-company-bulk.component.html",
  styleUrls: ["./register-company-bulk.component.scss"],
  animations: [SharedAnimations],
})
export class RegisterCompanyBulkComponent implements OnInit {
  private registered = 0;
  private failed = 0;
  public loading = false;
  public registering = false;
  public errMessage = {};
  public isValidFile = false;
  private fileData: any = {};
  private addUserUrl: string;
  public profile: any;
  public file: any;

  constructor(
    private http: HttpService,
    private tinService: TinService,
    private localStore: LocalStoreService,
    private toastService: ToastrService,
    private breadcrumb: BreadcrumbService,
    private router: Router
  ) {
    this.addUserUrl = "/users/add_company";
  }

  ngOnInit() {
    this.profile = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("dashboardRegisterCompanyBulk");
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  submit() {
    if (!this.file) {
      this.toastService.error("No file selected.");
      return;
    }

    if (!this.file.name.match(/(.xls|.xlsx)/)) {
      this.toastService.error("Invalid file format selected.");
      return;
    }

    this.loading = true;

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file);
    reader.onload = (e: any) => {
      const byteString: string = e.target.result;
      const xlsWb: XLSX.WorkBook = XLSX.read(byteString, { type: "binary" });
      const wsname: string = xlsWb.SheetNames[0];
      const currentWS: XLSX.WorkSheet = xlsWb.Sheets[wsname];
      this.fileData = XLSX.utils.sheet_to_json(currentWS);
    };

    reader.onloadend = () => {
      this.loading = false;
      this.registerUsers();
    };
  }

  private registerUsers() {
    this.toastService.info(`${this.fileData.length} record(s) found.`);
    if (this.fileData.length) {
      let done = 0;
      this.failed = 0;
      this.registered = 0;
      this.registering = true;
      this.fileData.forEach((record: any) => {
        const company = this.prepareUsers(record);

        console.log({ company });
        this.http.doPost(this.addUserUrl, company).subscribe(
          (res) => {
            // console.log(res);
            done += 1;
            this.registered += 1;
            if (done == this.fileData.length) {
              this.handleDone();
              this.router.navigateByUrl("/setup/companies");
            }
          },
          (err) => {
            // console.log(err);
            done += 1;
            this.failed += 1;
            if (done == this.fileData.length) {
              this.handleDone();
            }
          }
        );
      });
    }
  }

  private prepareUsers(data: IExcelCompany): any {
    // console.log(data);
    let company: ICompany | any = {};
    company.address = data.ADDRESS_REQUIRED;
    company.company_name = data.COMPANY_NAME_REQUIRED;
    company.business_industry = data.INDUSTRY_REQUIRED;
    company.employee_count = data.EMPLOYEE_COUNT_REQUIRED;
    company.lga = data.LGA_REQUIRED;
    company.rc_no = data.RC_NO_REQUIRED;
    company.state = data.STATE_REQUIRED;
    if (data.TIN_OPTIONAL) company.tin = data.TIN_OPTIONAL;
    if (data.WEBSITE_OPTIONAL) company.office_email = data.EMAIL_OPTIONAL;
    if (data.EMAIL_OPTIONAL) company.office_email = data.EMAIL_OPTIONAL;
    if (data.OFFICE_NUMBER_OPTIONAL)
      company.office_number = data.OFFICE_NUMBER_OPTIONAL;

    return company;
  }

  private handleDone() {
    this.registering = false;
    this.toastService.info(
      `${this.registered} registered successfully. ${this.failed} failed.`
    );
  }
}
