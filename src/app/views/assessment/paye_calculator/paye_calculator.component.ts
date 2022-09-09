import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PayeeCalculator } from "src/app/shared/models/payee_calculator";

import { SharedAnimations } from "src/app/shared/animations/shared-animations";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./paye_calculator.component.html",
  styleUrls: ["./paye_calculator.component.scss"],
  animations: [SharedAnimations],
})
export class Paye_calculatorComponent implements OnInit {
  public mdas: any = [];

  public taxItems: any = [];

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  @ViewChild("acceptTerms", { static: true }) private acceptTermsModal;

  selectedTIN: any = null;

  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 50,
    moreText: "More",
    searchPlaceholder: "Search by TIN.",
    noResultsFound: "No results found!",
    searchOnKey: "tin",
  };

  directAssessmentForm: FormGroup;

  public loading: boolean = false;

  id: string;
  public payeeForm: FormGroup;

  public revenue_return_assessment: boolean = false;

  constructor(private fb: FormBuilder) {}

  @Input() gross_income: string;

  calculatePAYE(){

    
  }

  ngOnInit() {
    this.directAssessmentForm = this.fb.group({
      income_basic_salary: [],
      income_housing: [],
      income_transport: [],
      gross: [],
      taxable_income: [],
      tax_payable_monthly: [],
      tax_payable: [],
      cra: [],
      dev_levy: [],
      deduction_nhf: [],
      deduction_nhis: [],
      deduction_pension: [],
      deduction_life_premium: [],
    });

    this.directAssessmentForm.valueChanges.subscribe((data) => {
      const taxCalculator = new PayeeCalculator();
      const result: any = taxCalculator.CalculatePayee({
        income_basic_salary: data.income_basic_salary || 0,
        income_housing: data.income_housing || 0,
        income_transport: data.income_transport || 0,
        is_consolidated: "yes",
        deduction_pension: data.deduction_pension,
        deduction_nhis: data.deduction_nhis,
        deduction_nhf: data.deduction_nhf || 0,
      });
      console.log({ taxCalculator });
      this.directAssessmentForm.patchValue(
        {
          taxable_income: Number(taxCalculator.taxable_income).toFixed(2),
          tax_payable: Number(taxCalculator.tax).toFixed(2),
          tax_payable_monthly: Number(taxCalculator.tax / 12).toFixed(2),
          cra: Number(taxCalculator.cra).toFixed(2),
          gross: Number(taxCalculator.gross_income).toFixed(2),
        },
        { emitEvent: false }
      );
    });
  }

  // CommaFormatted(event) {
  //   // skip for arrow keys
  //   console.log({ event });
  //   // format number
  //   this.directAssessmentForm.valueChanges.subscribe((data) => {
  //     this.directAssessmentForm.patchValue(
  //       {
  //         income_basic_salary: String(data.income_basic_salary)
  //           .replace(/\D/g, "")
  //           .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  //       },
  //       { emitEvent: false }
  //     );
  //   });
  // }

  // numberCheck(args) {
  //   if (args.key === "e" || args.key === "+" || args.key === "-") {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
}
