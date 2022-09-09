import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { HttpService } from "src/app/shared/services/http.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { SelfAssessmentService } from "src/app/shared/services/self-assessment.service";

@Component({
  selector: "app-consumption-tax",
  templateUrl: "./consumption-tax.component.html",
  styleUrls: ["./consumption-tax.component.scss"],
  animations: [SharedAnimations],
})
export class ConsumptionTaxComponent implements OnInit {
  private taxItem: any;
  private tax_item_id = 17;

  public user: any;

  public taxForm: FormGroup;
  public loading = false;
  public submitted = false;
  public saving = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService,
    private breadcrumb: BreadcrumbService,
    private localStore: LocalStoreService,
    private selfAssService: SelfAssessmentService
  ) {}

  ngOnInit() {
    this.user = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("consumptionTax");

    this.taxForm = this.fb.group({
      mda_id: [""],
      tax_item_id: [""],
      tax_item: [""],
      mda: [""],
      payer_tin: [""],
      payer_name: [""],
      created_by: [""],
      start_tax_period: ["", Validators.required],
      end_tax_period: ["", Validators.required],
      account_officer: ["", Validators.required],
      account_officer_tin: [
        "",
        Validators.required,
        // , Validators.pattern('[0-9]{10}')
      ],
      description: ["", Validators.required],
      amount: [
        "",
        Validators.required,
        // Validators.pattern('^[1-9]\d*(\.\d+)?$')
      ],
    });

    this.route.queryParams.subscribe((params) => {
      if (params.payer_tin && params.payer_name) {
        this.getTaxItemInfo(params);
      } else {
        this.getTaxItemInfo(params);
      }
    });

    this.loadTins();
  }

  getTaxItemInfo(params?: any) {
    console.log({ params });

    this.loading = true;
    this.http.doGet(`tax_items/${this.tax_item_id}`).subscribe(
      (res: any) => {
        this.taxItem = res;

        if (!res) {
          this.toastService.error("Tax item does not exist.", "Not Found!");
          this.router.navigateByUrl("assessment/perform");
        }

        const profileName =
          this.user.name || `${this.user.first_name} ${this.user.surname}`;
        this.taxForm.patchValue({
          payer_tin: params.payer_tin ? params.payer_tin : "",
          payer_name: params.payer_name ? params.payer_name : "",
          tax_item_id: this.taxItem.id,
          mda: this.taxItem.mda,
          mda_id: this.taxItem.mda_id,
          tax_item: this.taxItem.title,
          account_officer: profileName,
          account_officer_tin: this.user.tin,
          created_by: profileName,
        });

        this.loading = false;
      },
      (err: any) => {
        console.log({ err });
        this.loading = false;
        this.toastService.error("Retrieving tax item failed.", "Not Found!");
        this.router.navigateByUrl("assessment/perform");
      },
      () => {}
    );
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
                    name: `${data.first_name}  ${data.surname}`,
                  };
                } else {
                  return {
                    ...data,
                    payer_name: data.name,
                    name: `${data.name}`,
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
    return this.http.doGet("/users/search_tins?tin=" + term);
  }

  config = {
    displayKey: "company_name",
    search: true,
    limitTo: 50,
    moreText: "More",
    searchPlaceholder: "Search by TIN.",
    noResultsFound: "No results found!",
    searchOnKey: "tin",
  };

  onDropdownClick() {
    if (this.taxForm.value.payer_tin) {
      const matched = this.foundTins.find(
        (el) => el.tin == this.taxForm.value.payer_tin
      );
      console.log({ matched, tin: this.taxForm.value.payer_tin });
      this.taxForm.patchValue({
        payer_name: matched.payer_name,
      });
    }
  }

  get taxf() {
    return this.taxForm.controls;
  }

  saveAssessment() {
    this.submitted = true;
    console.log(this.taxForm.value);

    if (this.taxForm.valid) {
      this.saving = true;
      const user_id = this.user.id;
      const amount = this.selfAssService.calculateConsumptionTax(
        this.taxForm.value.amount
      );
      let {
        mda,
        tax_item,
        account_officer_tin,
        start_tax_period,
        end_tax_period,
        description,
        ...data
      } = this.taxForm.value;
      const account_officer = `${data.account_officer} (${account_officer_tin})`;
      start_tax_period = moment(start_tax_period.toString()).format(
        "MMMM YYYY"
      );
      end_tax_period = moment(end_tax_period.toString()).format("MMMM YYYY");
      const display = JSON.stringify({
        start_tax_period,
        end_tax_period,
        form_amount: this.taxForm.value.amount,
        mda,
        amount,
        tax_item,
      });
      const assessment: any = Object.assign(
        {},
        { ...data, user_id, account_officer, amount, display, description }
      );

      this.http.doPost("/assessment/save", assessment).subscribe(
        (response: any) => {
          this.loading = true;
          this.toastService.success("Assessment Saved. Wait...", "Successful!");
          this.router.navigateByUrl(
            `assessment/perform?view=${response.data.id}`
          );
        },
        (err: any) => {
          this.saving = false;
          this.submitted = false;
          this.toastService.error(
            "Unexpected error. Please retry.",
            "Not Found!"
          );
        },
        () => {
          this.saving = false;
          this.submitted = false;
        }
      );
    }
  }
}
