import { Directive, Input  } from "@angular/core";
import {Validator, NG_VALIDATORS, AbstractControl  } from "@angular/forms";

@Directive({
  selector:'[valueEqualTo]',
  providers:[
    { provide: NG_VALIDATORS,
      useExisting: ConfirmEqualValidatorDirective,
      multi: true
    }
  ]
})

export class ConfirmEqualValidatorDirective implements Validator {
  @Input() valueEqualTo: string;

  validate(control: AbstractControl):{[key:string]: any} |null {
    const controlToCompare = control.parent.get(this.valueEqualTo);
    if(controlToCompare && controlToCompare.value !==control.value){
    return { 'notEqual': true}
    }
    return null;
    }
    
}