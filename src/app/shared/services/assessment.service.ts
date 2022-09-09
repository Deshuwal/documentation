import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of, Subject, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpService } from "./http.service";
import { parse } from "querystring";
import { PayeeCalculator } from "../models/payee_calculator";

@Injectable({
  providedIn: "root",
})
export class AssessmentService {
  //Only for demo purpose
  authenticated = true;

  public bulkDemandNotice = new Subject();

  constructor(
    private store: LocalStoreService,
    private httpService: HttpService,
    private router: Router
  ) {}

  public doAssessment(rules: any) {
    let res: number = 0;

    /* ["10", "%", "no_of_people", "-", "incidental_cost_of_sales
    engine:[
            ["100","*", "no_of_people"]
            ["10", "%", "no_of_people", "-", "incidental_cost_of_sales"]
]

  */

    // if(this.isDigit())

    let i: number = 0;
    while (i < rules.engine.length) {
      let side1 = "";
      let operator = "";
      let side2 = "";

      if (this.isDigit(rules.engine[i])) {
        side1 = rules.engine[i];
        i++;
      } else if (this.isKey(rules, rules.engine[i])) {
        side1 = this.getElementValue(rules, rules.engine[i]);
        i++;
      }

      if (this.isOperator(rules.engine[i])) {
        operator = rules.engine[i];
        i++;
      }

      if (this.isDigit(rules.engine[i])) {
        side2 = rules.engine[i];
        i++;
      } else if (this.isKey(rules, rules.engine[i])) {
        side2 = this.getElementValue(rules, rules.engine[i]);
        i++;
      }

      console.log("side1", side1, "side2", side2, "res", res, i);

      if (side1.length < 0 && side2.length < 0) {
        console.log("ERROR EMPTY ");
        return null;
      }

      let number1 = Object.is(parseInt(side1), NaN)
        ? res
        : parseInt(side1) + res;

      let number2 = parseInt(side2);

      console.log(
        "number 1",
        parseInt(side1) == NaN,
        number1,
        " number 2",
        number2
      );

      switch (operator) {
        case "*":
          res = number1 * number2;

          break;

        case "+":
          res = number1 + number2;
          break;

        case "%":
          res = (number2 / 100) * number1;
          break;

        case "-":
          res = number1 - number2;
          break;
      }
    }

    return res;
  }

  arrangePayeeFormDataForDisplay(
    formData: any,
    payee_calculator: PayeeCalculator
  ) {
 
    let result: any = {};
    result.cra = payee_calculator.cra;
    result.gi = payee_calculator.gross_income;
    result.ti = payee_calculator.taxable_income;
    result.nhis = payee_calculator.nhis;
    result.pe = payee_calculator.pe;
    result.nhs = payee_calculator.nhs;
    result.li = payee_calculator.li;
    result.paye = payee_calculator.tax;
    result.period = `${formData.period_from} - ${formData.period_to}`;
    result.dev_levy = payee_calculator.dev_levy;
    result.mda = "PSIRS";
    result.tax_item = "PAYE";
    result.deductions = payee_calculator.total_deductions;
    result.name = formData.name;
    return result;
  }

  arrangeBulkPayeeFormDataForDisplay(
    formData: any,
    payee_calculator: PayeeCalculator
  ) {
    console.log("ruuuuuuuuuuuuuuuuuu", formData);
    let result: any = [];
    // result.cra = payee_calculator.cra;
    // result.gi = payee_calculator.gross_income;
    // result.ti = payee_calculator.taxable_income;
    // result.paye = payee_calculator.tax;
    // result.mda = "PSIRS";
    // result.tax_item = "PAYE";
    // result.deductions = payee_calculator.total_deductions;
    return result;
  }

  arrangeDirectAssessmentHighNetWorthFormDataForDisplay(formData: any) {
    let result: any = {};
    formData.forEach((element) => {
      result = { ...result, [element.label]: element["value"] };
    });
    result.mda = "PSIRS";
    result.tax_item = "PAYE";
    return result;
  }

  arrangeDirectAssessmentFormDataForDisplay(formData: any) {
    let allTotal: number = 0;
    let keys: any = [];

    formData.forEach((item) => {
      if (!isNaN(item.value) && item.label != "bvn") {
        allTotal += parseInt(item.value);
        keys.push({ label: item.label, value: item.value });
      }
    });

    keys.push({ total: allTotal });
    return keys;
  }

  arrangePresumptiveDataFormDataForDisplay(formData: any) {
    const parsedDta = JSON.parse(formData.display);
    formData.business_category = parsedDta.business_category;
    formData.business_type = parsedDta.business_type;
    formData.association = parsedDta.association;
    return formData;
  }
  getElementValue(rules: any, key: any) {
    for (let i = 0; i < rules.elements.length; i++) {
      if (rules.elements[i].name == key) {
        return rules.elements[i].value;
      }
    }

    return null;
  }

  isOperator(item: any) {
    let operators = "*+-%/";
    let result = false;

    result = operators.indexOf(item) > -1;

    console.log("is operator ", item, result);
    return result;
  }

  isKey(rules: any, item: any) {
    let result = false;

    for (let i = 0; i < rules.elements.length; i++) {
      if (rules.elements[i].name == item) {
        result = true;
      }
    }

    console.log("is key ", rules, item, result);
    return result;
  }

  isDigit(item: any) {
    let result = isNaN(item) ? false : true;

    console.log("is digit ", item, result);

    return result;
  }

  priVehicleCategories: any = [
    { tag: "a", label: "Category A (Above 3.0cc)" },
    { tag: "b", label: "Category B (2.1 - 3.0cc) " },
    { tag: "c", label: "Category C (1.7 - 2.00c) " },
    { tag: "d", label: "Category D (1.2 - 1.6cc) " },
  ];

  governmentFancyNumberPlateCategories: any = [
    { tag: "bus", label: "Bus" },
    { tag: "car", label: "Car" },
    { tag: "car", label: "Car" },
  ];

  motorCycleCategories: any = [
    { tag: "private", label: "Private" },
    { tag: "commercial", label: "Commercial" },
  ];

  governmentOfficialNumberPlateCategories: any = [
    { tag: "a", label: "Category A" },
    { tag: "b", label: "Category B" },
    { tag: "bus", label: "Bus" },
    { tag: "motorcycle", label: "Motorcycle" },
  ];

  changeOfOwnershipCategories: any = [
    { tag: "motorvehicle", label: "Motor Vehicle" },
    { tag: "motorcycle_tricycle", label: "Motorcycle/Tricycle" },
  ];

  driverLicenceCategories: any = [
    { tag: "motorvehicle", label: "Motor Vehicle" },
    { tag: "motorcycle_tricycle", label: "Motorcycle/Tricycle" },
  ];

  roadSideParkingFeesCategories: any = [
    { tag: "one_hour", label: "1st Hour" },
    { tag: "two_four_hours", label: "2 - 4 Hours" },
    { tag: "over_four_hours", label: "More than 4 hours" },
  ];
  
  // Learners Permit
  learnersPermits: any = [
    { tag: "with_l_symbol", label: "With L Symbol" },
    { tag: "without_l_symbol", label: "Without L Symbol" }
  ];

  commercialVehicleCategories: any = [
    { tag: "a", label: "Category A (Trailer)" },
    { tag: "b", label: "Category B (Tanker & Truck)" },
    { tag: "c", label: "Category C (Tipper and Lorry) " },
    { tag: "d", label: "Category D (Canter) " },

    { tag: "e", label: "Category E (Bus) " },

    { tag: "f", label: "Category F (Pickup) " },

    { tag: "g", label: "Category G (Painted Taxi) " },

    { tag: "c", label: "Category C (Unpainted Taxi) " },
  ];

  outOfSeriesNumberPlatesCategories: any = [
    { tag: "a", label: "Category A (Above 3.0cc)" },
    { tag: "b", label: "Category B (2.1 - 3.0cc) " },
    { tag: "c", label: "Category C (1.7 - 2.00c) " },
  ];

  missingNumberPlatesCategories: any = [
    { tag: "fancy", label: "Fancy" },
    { tag: "out_of_series", label: "Out of Series " },
    { tag: "private", label: "Private " },
    { tag: "commercial", label: "Commercial" },
    { tag: "motorcycle_tricycle", label: "Motorcycle/Tricycle" },
  ];

  motorDealersPlateCategories: any = [{ tag: "all", label: "All Categories" }];

  mortorDealersPlateRules: any = [
    {
      label: "Category A",
      tag: "all",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 30000 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 5000,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 12000 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },
  ];

  missingPlateNumberRules: any = [
    {
      label: "Category A",
      tag: "fancy",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Plate Number Replacement",
          amount: 80000,
        },
      ],
    },

    {
      label: "Category A",
      tag: "out_of_series",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Plate Number Replacement",
          amount: 40000,
        },
      ],
    },

    {
      label: "Category A",
      tag: "private",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Plate Number Replacement",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category A",
      tag: "commercial",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Plate Number Replacement",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category A",
      tag: "motorcycle_tricycle",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Plate Number Replacement",
          amount: 2500,
        },
      ],
    },
  ];

  privateVehicleRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 6250,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 3125 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 6250,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 2500 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 3125,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 1875 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },

    {
      label: "Category D",
      tag: "d",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 3125,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 1250 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },
  ];

  privateMotorCycleRules: any = [
    {
      label: "Private",
      tag: "private",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 3000 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 1250,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 625 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
        { tag: "learners_permit", label: " Learner's Permit", amount: 250 },
        { tag: "reflective_jacket", label: "Reflective Jacket", amount: 0 },
      ],
    },

    {
      label: "Commercial",
      tag: "commercial",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 2500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 1250,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 1250 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },

        { tag: "sticker", label: " Sticker ", amount: 550 },
        { tag: "learners_permit", label: " Learner's Permit", amount: 1250 },
        { tag: "reflective_jacket", label: " Regt Book", amount: 750 },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 3125,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 1875 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },

    {
      label: "Category D",
      tag: "d",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
        {
          tag: "vehicle_registration",
          label: "Vehicle Registration",
          amount: 3125,
        },
        { tag: "vehicle_licence", label: "Vehicle Licence", amount: 1250 },
        { tag: "cost_of_registration_book", label: " Regt Book", amount: 1250 },
      ],
    },
  ];

  outOfSeriesPlateNumberRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 40000 },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 40000 },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 40000 },
      ],
    },
  ];

  roadSideParkingRules: any = [
    {
      label: "Category A",
      tag: "one_hour",
      fees: [
        { tag: "urban", label: "Urban Road Side Parking", amount: 50 },
        {
          tag: "semi_urban",
          label: "Semi-Urban Road Side Parking",
          amount: 20,
        },
        { tag: "rural", label: "Rural Road Side Parking", amount: 0 },
      ],
    },

    {
      label: "Category B",
      tag: "two_four_hours",
      fees: [
        { tag: "urban", label: "Urban Road Side Parking", amount: 100 },
        {
          tag: "semi_urban",
          label: "Semi-Urban Road Side Parking",
          amount: 50,
        },
        { tag: "rural", label: "Rural Road Side Parking", amount: 20 },
      ],
    },

    {
      label: "Category C",
      tag: "over_four_hours",
      fees: [
        { tag: "urban", label: "Urban Road Side Parking", amount: 200 },
        {
          tag: "semi_urban",
          label: "Semi-Urban Road Side Parking",
          amount: 100,
        },
        { tag: "rural", label: "Rural Road Side Parking", amount: 50 },
      ],
    },
  ];

  changeOfOwnershipRules: any = [
    {
      label: "Category A",
      tag: "motorvehicle",
      fees: [
        {
          tag: "change_of_ownership",
          label: "Change of Ownership",
          amount: 2500,
        },
      ],
    },

    {
      label: "Category B",
      tag: "motorcycle_tricycle",
      fees: [
        { tag: "change_of_ownership", label: "Plate Number", amount: 625 },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 40000 },
      ],
    },
  ];
  

  learnersPermitRules: any = [
    {
      label: "With L Symbol",
      tag: "with_l_symbol",
      fees: [
        {tag: "with_l_symbol", label: "With L Symbol (N750)", amount: 750},
      ],
    },

    {
      label: "Without L Symbol",
      tag: "without_l_symbol",
      fees: [
        { tag: "without_l_symbol", label: "Without L Symbol (N500)", amount: 500 },
      ],
    }
  ];

  driverLicenseRules: any = [
    {
      label: "Category A",
      tag: "motorvehicle",
      fees: [
        { tag: "drivers_license", label: "Driver's License", amount: 6350 },
      ],
    },

    {
      label: "Category B",
      tag: "motorcycle_tricycle",
      fees: [
        { tag: "drivers_license", label: "Driver's License", amount: 625 },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 40000 },
      ],
    },
  ];

  governmentOfficialPlateNumberRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 15000 },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 15000 },
      ],
    },

    {
      label: "Bus",
      tag: "bus",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 15000 },
      ],
    },
  ];

  fancyPlateNumberRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Get Fancy Plate Number",
          amount: 80000,
        },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Get Fancy Plate Number",
          amount: 80000,
        },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        { tag: "cost_of_plate_number", label: "Plate Number", amount: 12500 },
      ],
    },

    {
      label: "Category D",
      tag: "d",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Fancy Palte Number",
          amount: 80000,
        },
      ],
    },
  ];

  revalidationOldNumberPlatePrivateRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 10000,
        },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 10000,
        },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 10000,
        },
      ],
    },

    {
      label: "Category D",
      tag: "d",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 10000,
        },
      ],
    },
  ];

  governmentFancyPlateRules: any = [
    {
      label: "Category A",
      tag: "bus",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 0,
        },
      ],
    },

    {
      label: "Category B",
      tag: "car",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 0,
        },
      ],
    },

    {
      label: "Category C",
      tag: "car",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 0,
        },
      ],
    },
  ];

  revalidationOldNumberPlateCommercialRules: any = [
    {
      label: "Category A",
      tag: "a",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category B",
      tag: "b",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category C",
      tag: "c",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category D",
      tag: "d",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category E",
      tag: "e",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },
    {
      label: "Category f",
      tag: "f",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },
    {
      label: "Category G",
      tag: "g",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },

    {
      label: "Category H",
      tag: "h",
      fees: [
        {
          tag: "cost_of_plate_number",
          label: "Revalidate Plate Number",
          amount: 12500,
        },
      ],
    },
  ];
}
