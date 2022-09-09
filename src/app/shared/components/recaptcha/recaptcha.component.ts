import { Component } from "@angular/core";
import { RecaptchaErrorParameters } from "ng-recaptcha";

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: "app-recaptcha",
  templateUrl: "./recaptcha.component.html",
  styleUrls: ["./recaptcha.component.scss"],
})
export class RecaptchaComponent {
  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
