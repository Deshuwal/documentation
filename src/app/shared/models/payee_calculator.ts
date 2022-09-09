import { Console } from "console";

export interface DirectAssment {
  gi: number;
  cra: number;
  ti: number;
  tax: number;
}

export class PayeeCalculator {
  public gross_income: number;
  public taxable_income: number;
  public total_deductions: number;
  public tax: number;
  public allowable_deduction_pension = 0;
  public allowable_deduction_nhf = 0;
  public cra = 0;
  public nhs = 0;
  public li = 0;
  public pe = 0;
  public nhis = 0;
  public dev_levy = 0;

  public CalculateDirectAssessment(value) {
    let directAss: DirectAssment = {
      gi: 0,
      cra: 0,
      ti: 0,
      tax: 0,
    };

    directAss.gi = value;

    directAss.cra = this.getConsolidatedRelief(value);
    directAss.ti = directAss.gi - directAss.cra;
    if (directAss.ti > 300000) {
      directAss.tax = this.getGraduatingTax(directAss.ti);
    } else {
      directAss.tax = this.getMinimumTax(directAss.ti, directAss.gi);
    }

    return directAss;
  }

  public CalculatePayee(values: any) {
    console.log("received ", values);
    let total_income: number = 0;
    let total_deductions: number = 0;
    let taxable_income: number = 0;
    this.dev_levy =
      values.dev_levy && typeof values.dev_levy == "string"
        ? values.dev_levy.toLowerCase() == "yes"
          ? 300
          : 0
        : 0;

    if (
      typeof values.is_consolidated == "string" &&
      values.is_consolidated.toLowerCase() == "yes"
    ) {
      return this.getTaxConsolidatedAmount(values);
    }

    if (
      typeof values["deduction_pension"] == "string" &&
      values["deduction_pension"].toLowerCase() == "yes"
    ) {
      this.allowable_deduction_pension +=
        ((values["income_basic_salary"] +
          values["income_housing"] +
          values["income_transport"]) *
          8) /
        100;
      this.pe = this.allowable_deduction_pension * 12;
    }

    if (
      typeof values["deduction_nhf"] == "string" &&
      values["deduction_nhf"].toLowerCase() == "yes"
    ) {
      this.allowable_deduction_nhf +=
        (values["income_basic_salary"] * 2.5) / 100;

      this.nhs = this.allowable_deduction_nhf * 12;
    }

    if (values["deduction_life_premium"]) {
      this.li += values["deduction_life_premium"] * 12;
    }

    if (values["deduction_nhis"]) {
      this.nhis += values["deduction_nhis"] * 12;
    }

    // IT RESOLVES TO NAN
    if (isNaN(this.allowable_deduction_nhf)) {
      this.allowable_deduction_nhf = 0;
    }
    if (isNaN(this.allowable_deduction_pension)) {
      this.allowable_deduction_pension = 0;
    }

    console.log(
      "######",
      values["income_basic_salary"],
      values["income_housing"],
      values["income_transport"]
    );

    for (var key in values) {
      let value = values[key];
      if (value == null) continue;

      if (key.indexOf("income") > -1) {
        total_income += typeof value == "number" ? value : 0;
      } else if (key.indexOf("deduction") > -1) {
        total_deductions += typeof value == "number" ? value : 0;
      }
    }

    total_income *= 12;
    total_deductions *= 12;
    total_deductions +=
      this.allowable_deduction_pension * 12 + this.allowable_deduction_nhf * 12;
    this.gross_income = total_income;
    let consolidatedRelief = this.getConsolidatedRelief(total_income);
    this.cra = consolidatedRelief;

    console.log(
      "Total income",
      total_income,
      "total deductions ",
      total_deductions
    );

    console.log({
      gggg: this.allowable_deduction_pension,
      hhh: this.allowable_deduction_nhf,
    });

    console.log("conslidated relief", consolidatedRelief);
    this.total_deductions = total_deductions;
    taxable_income = total_income - total_deductions;

    if (total_income - consolidatedRelief > 0) {
      taxable_income -= consolidatedRelief;
      // total_deductions+= consolidatedRelief;
      console.log("total deductions ", this.total_deductions);
    } else {
      let tax = total_income * 0.01;
      this.tax = tax;
      return total_income * 0.01;
    }

    this.taxable_income = taxable_income;

    let tax: number = 0;
    console.log(
      "Taxable income ",
      taxable_income,
      " gross income ***1 ",
      this.gross_income
    );

    if (taxable_income > 300000) {
      tax = this.getGraduatingTax(taxable_income);
    } else {
      tax = this.getMinimumTax(taxable_income, this.gross_income);
    }

    console.log("tax is ", tax);
    tax = parseInt(Number(tax).toFixed(2), 10);
    this.tax = tax;
    return tax;
  }

  private getConsolidatedRelief(gross_income: number) {
    let twenty_percent = (20 / 100) * gross_income;
    let relief = (1 / 100) * gross_income;
    console.log("relief 20% of ", gross_income, twenty_percent);
    console.log("relief 1% of ", gross_income, relief);
    let result = Math.max(200000, relief);
    result = result + twenty_percent;
    return result;
  }

  private getMinimumTax(taxable_income: number, gross_income: number) {
    console.log("gross income ", taxable_income, " taxable ", taxable_income);
    let ti = (7 / 100) * taxable_income;
    let gi = (1 / 100) * gross_income;
    return ti > gi ? ti : gi;
  }

  private getTaxConsolidatedAmount(values) {
    console.log({ values });
    const formValues = { ...values };
    let pension = 0;
    let nhf = 0;
    let nhis = 0;
    let consolidatedRelief = 0;
    let taxable_income = 0;
    let total_income =
      ((formValues.income_basic_salary || 0) +
        (formValues.income_housing || 0) +
        (formValues.income_others || 0) +
        (formValues.income_transport || 0)) *
      12;
    this.gross_income = total_income;
    if (
      formValues.deduction_pension == "yes" ||
      formValues.deduction_pension == "Yes"
    ) {
      pension =
        ((((formValues["income_basic_salary"] || 0) +
          (formValues["income_housing"] || 0) +
          (formValues["income_transport"] || 0)) *
          8) /
          100) *
        12;
    }

    if (
      typeof formValues["deduction_nhf"] == "string" &&
      formValues["deduction_nhf"].toLowerCase() == "yes"
    ) {
      nhf +=
        (((formValues.income_basic_salary || 0) +
          (formValues.income_housing || 0) +
          (formValues.income_others || 0) +
          (formValues.income_transport || 0) * 2.5) /
          100) *
        12;
    }

    if (formValues["deduction_life_premium"]) {
      this.li += formValues["deduction_life_premium"] * 12;
    }

    if (formValues["deduction_nhis"]) {
      this.nhis += formValues["deduction_nhis"] * 12;
    }

    consolidatedRelief = this.getConsolidatedRelief(total_income);
    this.cra = consolidatedRelief;

    console.log("conslidated relief", consolidatedRelief);
    this.nhs = nhf;
    this.pe = pension;
    this.total_deductions = pension + nhf + nhis;
    taxable_income = total_income - this.total_deductions;
    console.log({ " **************1": taxable_income });
    this.taxable_income = taxable_income;

    if (total_income - consolidatedRelief > 0) {
      taxable_income -= consolidatedRelief;
      console.log("total deductions ", this.total_deductions);
    } else {
      let tax = total_income * 0.01;
      this.tax = tax;
      return total_income * 0.01;
    }

    this.taxable_income = taxable_income;

    let tax: number = 0;
    console.log({ " **************2": { taxable_income, total_income } });
    if (taxable_income > 300000) {
      tax = this.getGraduatingTax(taxable_income);
    } else {
      tax = this.getMinimumTax(taxable_income, total_income);
    }

    console.log("tax is ", tax);
    tax = parseInt(Number(tax).toFixed(2), 10);
    this.tax = tax;
    return tax;
  }

  private getGraduatingTax(income: number) {
    let level1: number = 0,
      level2: number = 0,
      level3: number = 0,
      level4: number = 0,
      level5: number = 0,
      level6: number = 0,
      amount_remainder: number = income,
      chargeable: boolean = true;

    if (amount_remainder < 300000) {
      level1 = (7 / 100) * amount_remainder;
      return level1;
    } else {
      level1 = (7 / 100) * 300000;
      amount_remainder -= 300000;
    }

    if (amount_remainder < 300000) {
      level2 = (11 / 100) * amount_remainder;
      return level1 + level2;
    } else {
      level2 = (11 / 100) * 300000;
      amount_remainder -= 300000;
    }

    if (amount_remainder < 500000) {
      level3 = (15 / 100) * amount_remainder;
      return level1 + level2 + level3;
    } else {
      level3 = (15 / 100) * 500000;
      amount_remainder -= 500000;
    }

    if (amount_remainder < 500000) {
      level4 = (19 / 100) * amount_remainder;
      return level1 + level2 + level3 + level4;
    } else {
      level4 = (19 / 100) * 500000;
      amount_remainder -= 500000;
    }

    if (amount_remainder < 1600000) {
      level5 = (21 / 100) * amount_remainder;
      return level1 + level2 + level3 + level4 + level5;
    } else {
      level5 = (21 / 100) * 1600000;
      amount_remainder -= 1600000;
    }

    level6 = amount_remainder * (24 / 100);
    // -----------------------------------
    //
    //------------------------------------
    return level1 + level2 + level3 + level4 + level5 + level6;
  }
}
