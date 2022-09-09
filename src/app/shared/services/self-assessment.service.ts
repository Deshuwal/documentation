import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BusinessTypes } from '../constants';
import { BusinessCategory, IBusinessType } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SelfAssessmentService {
  public assessmentItems = new Subject();

  public searchPersonalIncomeTaxItems(text: string): IBusinessType[] {
    const matchRegex = new RegExp(`${text}`, 'gi');
    const taxItemClone = BusinessTypes.map((x) => x);
    const allItem = taxItemClone.pop();
    const matches = taxItemClone.filter(
      (bizz: IBusinessType) => bizz.description.match(matchRegex).length
    );
    matches.push(allItem);
    return matches;
  }

  public calculatePersonalIncomeTax(
    bCategory: BusinessCategory,
    bType: IBusinessType
  ) {
    return bType.taxes[bCategory];
  }

  calculateDeductions(formCItems: any) {
    return Object.keys(formCItems)
      .filter(
        (key) => key.indexOf('deduction') >= 0 && !!parseFloat(formCItems[key])
      )
      .map((key) => parseFloat(formCItems[key]))
      .reduce((a, b) => a + b, 0);
  }

  public calculateEntertainmentTax(amount: string) {
    return (parseFloat(amount) * 0.05).toFixed(2);
  }

  public calculateConsumptionTax(amount: string) {
    return (parseFloat(amount) * 0.025).toFixed(2);
  }
}
