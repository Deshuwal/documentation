import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRecaptchaComponent } from '../create-recaptcha/create-recaptcha.component';
import { RenderRecaptchaDirective } from '../render-recaptcha/render-recaptcha.directive';

// Ng2 Recaptcha Module
@NgModule({
    imports: [
        CommonModule,
    ],

    declarations: [
        CreateRecaptchaComponent,
        RenderRecaptchaDirective,
    ],

    exports: [
        CreateRecaptchaComponent,
    ],

    providers: [
    ],
})
export class RecaptchaModule { }
