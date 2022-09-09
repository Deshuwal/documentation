// Imports
import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { RenderRecaptchaDirective } from '../render-recaptcha/render-recaptcha.directive';

//
// Main recpatcha component
//
@Component({

    moduleId: __filename,
    selector: 'ng2-google-recaptcha',

    template: `<div id="{{recaptchaId}}" ng2GoogleRecaptchaRender (onCaptchaComplete)="onCaptchaCompleted($event)"
                                                              [renderDelay]="renderDelay"
                                                              [siteKey]="siteKey"
                                                              [recaptchaId]="recaptchaId"
                                                              [captchaStyle]="captchaStyle"></div>`,
})
export class CreateRecaptchaComponent implements OnInit {

    // Properties passed through
    @Output('onCaptchaComplete') onCaptchaComplete: EventEmitter<any> = new EventEmitter();

    @Input('siteKey') siteKey: string = null;
    @Input('captchaStyle') captchaStyle: any = null;

    @Input('renderDelay') renderDelay: number = 500;

    @Input('recaptchaId') recaptchaId: string = 'grecaptcha';

    @ViewChild(RenderRecaptchaDirective)
    public recaptchaInstance: RenderRecaptchaDirective;

    //
    // Called to initialise the object
    //
    ngOnInit() {
    }

    //
    // Resets the current reCAPTCHA
    //
    resetRecaptcha() {

        // Reset the instance if we have one
        if (this.recaptchaInstance != null) {
            this.recaptchaInstance.resetRecaptcha();
        }
    }

    //
    // Called when the Captcha has finished
    //
    /* tslint:disable:no-unused-variable */
    public onCaptchaCompleted(data: string) {
        /* tslint:enable:no-unused-variable */

        // Pass through whether we succeeded or not
        if (data != null) {
            this.onCaptchaComplete.emit({
                success: true,
                token: data,
                recaptcha: this,
            });
        } else {
            this.onCaptchaComplete.emit({
                success: false,
                token: null,
                recaptcha: this,
            });
        }
    }
}
