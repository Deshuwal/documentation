import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from "xlsx";
import { Component, OnInit } from "@angular/core";
import { LocalStoreService } from "../../../shared/services/local-store.service";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { PayeeCalculator } from "src/app/shared/models/payee_calculator";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { concat,Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, map, filter } from "rxjs/operators";

@Component({
  selector: "app-dashboad-default",
  templateUrl: "./corporate.component.html",
  styleUrls: ["./corporate.component.css"],
  animations: [SharedAnimations],
})
export class CorporateRevenueReturnComponent implements OnInit {
  annualFile: any;
  userProfile: any;
  exceltoJson = [];
  exceltoJson2 = [];
  exceltoJson3 = [];
  isExcelFile: boolean;
  failed: number = 0;
  successful: number = 0;
  public done: boolean = false;
  public corporateRevenueReturnsForm: FormGroup;
  public loading: boolean = false;
  selectedCompanyData: any;
  companyTin: any;
  selectedTIN: any = null;
  public companyName: string = "---";

  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 50,
    moreText: "More",
    searchPlaceholder: "Search by TIN.",
    noResultsFound: "No results found!",
    searchOnKey: "tin",
  };


  private keys = {
    tin: "TIN",
    surname: "SURNAME",
    first_name: "FIRST NAME",
    middle_name: "MIDDLE NAME",
    designation: "DESIGNATION",
    nationality: "NATIONALITY",
    annual_tax_paid: "ANNUAL_TAX_PAID",
    dev_levy: "DEVELOPMENT LEVY",
    consolidated_amount: "GROSS INCOME",
    phone: "STAFF PHONE NUMBER",
    email: "STAFF EMAIL ADDRESS",
    deduction_voluntary_contribution_percentage: "Percentage if yes",
    is_consolidated: "is_cons",
  };

  private keys2 = {
    surname: "SURNAME",
    other_names: "OTHER NAMES",
    designation: "DESIGNATION",
    nationality: "NATIONALITY",
    consolidated_amount: "GROSS INCOME",
    phone: "STAFF PHONE NUMBER",
    email: "STAFF EMAIL ADDRESS"
  };

  private keys3 = {
    date_of_payment: "DATE OF PAYMENT",
    amount_paid: "AMOUNT PAID",
    receipt_number: "RECEIPT NUMBER",
    period_of_payment: "PERIOD OF PAYMENT",
    gross_income: "GROSS INCOME",
  };

  constructor(
    private localStore: LocalStoreService,
    private toastrService: ToastrService,
    private dl: HttpService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumb: BreadcrumbService,
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("corporateRevenueReturn");

    this.route.queryParams.subscribe(params => {
      console.log('paraommmm', params);
      this.getCompanyData(params.payer_tin);
    });

    this.corporateRevenueReturnsForm = this.fb.group({
      mda_id: [""],
      tax_item_id: [""],
      tin_slug: [""],
      company_name:[""],
      bulk_name: ["", Validators.required],
      period_from: ["", Validators.required],
      period_to: ["", Validators.required],
    });

    this.corporateRevenueReturnsForm.patchValue({ mda_id: 3, tax_item_id: 20 });
    this.loadTins();
    this.loadUsersTin();
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

  tins: any = [];

  loadUsersTin() {
    this.loading = true;
    this.dl.doGet("users/user_related_tins").subscribe(
      (res: any) => {
        this.tins = [
          ...res.data,
          {
            tin: this.userProfile.tin,
            company_name:
              this.userProfile.name && this.userProfile.name.trim()
                ? this.userProfile.name.trim()
                : `${this.userProfile.first_name} ${this.userProfile.surname}`,
          },
        ];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }


  getCompanies(term: string = null): Observable<any> {
    return this.dl.doGet("/users/search_tins?tin=" + term);
  }

  matchedTIN: any;

  onDropdownClick(item) {
    if (this.corporateRevenueReturnsForm.value.tin_slug) {
      const matches = this.corporateRevenueReturnsForm.value.tin_slug.match(/\((.*?)\)/);
      const matched = this.foundTins.find((el) => el.tin == matches[1]);
      // console.log({ matched });
      this.matchedTIN = matched;
    }
  }

  annualFileChanged(e) {
    this.annualFile = e.target.files[0];
  }

  submit() {

    // let data, header;
    if (!this.annualFile) {
      this.toastrService.error("You must select an annual return file.");
      return;
    }

    if (!this.annualFile.name.match(/(.xls|.xlsx|.csv)/)) {
      this.toastrService.error(
        "Invalid file format selected. Please select an excel file."
      );
      return;
    }  

    this.loading = true;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.annualFile);
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet 1*/
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.exceltoJson = XLSX.utils.sheet_to_json(ws);
      console.log('data', this.exceltoJson);

      const wsname2: string = wb.SheetNames[1];
      const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];
      /* save data */
      this.exceltoJson2 = XLSX.utils.sheet_to_json(ws2);
      console.log('data2', this.exceltoJson2);

      const wsname3: string = wb.SheetNames[2];
      const ws3: XLSX.WorkSheet = wb.Sheets[wsname3];
      /* save data */
      this.exceltoJson3 = XLSX.utils.sheet_to_json(ws3);
      console.log('data2', this.exceltoJson3);

    };

    reader.onloadend = (e) => {
      this.loading = false;
      //this.companyTin = (typeof this.matchedTIN !== 'undefined') ? this.matchedTIN.tin : this.corporateRevenueReturnsForm.value.tin_slug.tin;
      this.saveBulkRecord();
    };
  }

  getCompanyData(companyTin: any) {
    this.loading = true;
    console.log('companyTin', companyTin);
    this.dl
      .doGet("users/company_by_tin/" + companyTin)
      .subscribe(
        (res: any) => {     
          this.loading = false;
          if(res.status == "success") {
            this.selectedCompanyData = res.data;
            this.companyName = this.selectedCompanyData.company_name.trim();
            this.companyTin = this.selectedCompanyData.tin;
          }else{
            this.selectedCompanyData = res;
          }
          //this.saveBulkRecord();
        },
        (err) => {
          this.loading = false;
          this.toastrService.error(
            "An error occured... Please verify that the company TIN is correct"
          );
        }
      );
  }

  saveBulkRecord() {

    let valid = true;
    let validMsg = "";
    const BreakError = {};
    try {
      this.exceltoJson.forEach(function (rec) {
        if(rec["SURNAME"] == undefined){ valid = false; validMsg = "SURNAME"; throw BreakError;}
        if(rec["FIRST NAME"] == undefined){ valid = false; validMsg = "FIRST NAME"; throw BreakError;}
        if(rec["NATIONALITY"] == undefined){valid = false; validMsg = "NATIONALITY"; throw BreakError;}
        if(rec["NUMBER OF MONTHS"] == undefined){valid = false; validMsg = "NUMBER OF MONTHS"; throw BreakError;}
        if(rec["DEVELOPMENT LEVY"] == undefined){valid = false; validMsg = "DEVELOPMENT LEVY"; throw BreakError;}
        if(rec["GROSS INCOME"] == undefined){valid = false; validMsg = "GROSS INCOME"; throw BreakError;}
        if(rec["ANNUAL TAX PAID"] == undefined){valid = false; validMsg = "ANNUAL TAX PAID"; throw BreakError;}
        if(rec["STAFF PHONE NUMBER"] == undefined){ valid = false; validMsg = "STAFF PHONE NUMBER"; throw BreakError;}
        if(rec["STAFF EMAIL ADDRESS"] == undefined){valid = false; validMsg = "STAFF EMAIL ADDRESS"; throw BreakError;}
      }); 
    } catch (err) {
      if (err !== BreakError) throw err;
    }
    if(!valid){
      this.toastrService.error(validMsg + " feild is required in the uploaded file");
      return;
    }
    
    //return

    this.loading = true;
    let total_dev_levy = this.exceltoJson.reduce((acc, cur) => {
      if (
        cur["DEVELOPMENT LEVY"] &&
        typeof cur["DEVELOPMENT LEVY"] == "string" &&
        cur["DEVELOPMENT LEVY"].toLowerCase() == "yes"
      ) {
        return acc + 300;
      }
      return acc + 0;
    }, 0);

    const total_amount = this.exceltoJson.reduce((acc, cur) => {
      return acc + cur.ANNUAL_TAX_PAID;
    }, 0);

    const record = {
      // tax_item_id: 20,
      company_name: this.selectedCompanyData.company_name.trim(),
      company_tin: this.selectedCompanyData.tin,
      employee_no: this.exceltoJson.length,
      mda_id: 3,
      mda_name: "PSIRS",
      total_amount,
      user_id: this.userProfile.id,
      created_by:
        this.userProfile.name != null
          ? this.userProfile.name
          : `${this.userProfile.first_name} ${this.userProfile.surname}`,

      total_dev_levy,
      record: this.exceltoJson.map((item: any) =>
        this.prepareAssessmentToSave(item)
      ),

      annual_returns: JSON.stringify(this.exceltoJson.map((item: any) => this.prepareAnnualReturns(item))), 
      projections: JSON.stringify(this.exceltoJson2.map((item: any) => this.prepareProjections(item))), 
      schedules: JSON.stringify(this.exceltoJson3.map((item: any) => this.prepareSchedules(item))), 

    };

    console.log(">>>", record);

    return this.dl.doPost("assessment/save_corporate_revenue_return", record).subscribe(
      (res: any) => {
        this.loading = false;
        this.toastrService.success('Your returns have been submitted successfuly', 'Successful!');
      },
      (err) => {
        this.loading = false;
        this.toastrService.error("An error occured... Please try again");
      }
    );
    
  }

  prepareAssessmentToSave(item: any) {
    console.log({ excel: item });
    const assess = {
      mda_id: 3,
      tax_item_id: 20,
      user_id: this.userProfile.id,
      payer_name: this.selectedCompanyData.company_name.trim(),
      payer_tin: this.selectedCompanyData.tin,
      period_from: 1,
      period_to: 12,
      amount: item[this.keys.annual_tax_paid],
      created_by:
        this.userProfile.name != null
          ? this.userProfile.name
          : `${this.userProfile.first_name} ${this.userProfile.surname}`,
      form_items: {
        tin: item[this.keys.tin],
        name: `${item[this.keys.first_name]} ${item[this.keys.middle_name]} ${item[this.keys.surname]}`,
        deduction_voluntary_contribution_percentage:
          item[this.keys.deduction_voluntary_contribution_percentage],
        consolidated_amount: item[this.keys.consolidated_amount],
        is_consolidated: item[this.keys.is_consolidated],
        dev_levy: item[this.keys.dev_levy],
        amount: item[this.keys.annual_tax_paid],
        nationality: item[this.keys.nationality],
        designation: item[this.keys.designation],
        phone: item[this.keys.phone],
        email: item[this.keys.email],
      },
      rules: {},
    };

    const pCalc = new PayeeCalculator();
    pCalc.CalculatePayee(assess.form_items);
    assess.rules = pCalc;
    return assess;
  }

  prepareAnnualReturns(item: any) {
    const assess = {
        name: `${item[this.keys.first_name]} ${item[this.keys.middle_name]} ${item[this.keys.surname]}`,
        deduction_voluntary_contribution_percentage:
          item[this.keys.deduction_voluntary_contribution_percentage],
        consolidated_amount: item[this.keys.consolidated_amount],
        is_consolidated: item[this.keys.is_consolidated],
        dev_levy: item[this.keys.dev_levy],
        amount: item[this.keys.annual_tax_paid],
        nationality: item[this.keys.nationality],
        designation: item[this.keys.designation],
        phone: item[this.keys.phone],
        email: item[this.keys.email],
    };
    return assess;
  }

  prepareProjections(item: any) {
    const assess = {
        name: `${item[this.keys2.surname]} ${item[this.keys2.other_names]}`,
        designation: item[this.keys2.designation],
        nationality: item[this.keys2.nationality],
        consolidated_amount: item[this.keys2.consolidated_amount],
        phone: item[this.keys2.phone],
        amount: item[this.keys.annual_tax_paid],
        email: item[this.keys2.email]
    };
    return assess;
  }

  prepareSchedules(item: any) {
    const assess = {
      date_of_payment: item[this.keys3.date_of_payment],
      amount_paid: item[this.keys3.amount_paid],
      receipt_number: item[this.keys3.receipt_number],
      period_of_payment: item[this.keys3.period_of_payment],
      gross_income: item[this.keys3.gross_income]
    };
    return assess;
  }

}
