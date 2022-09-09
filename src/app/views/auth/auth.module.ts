import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { SigninComponent } from "./signin/signin.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";
import { ReCaptchaModule } from "angular-recaptcha3";
import { PasswordComponent } from "./password/password.component";
import { SharedDirectivesModule } from "src/app/shared/directives/shared-directives.module";
import { ConfirmEqualValidatorDirective } from "src/app/shared/directives/confirm-equal-validator.directive";
import { ForgotEmailComponent } from "./forgot_email/forgot.component";
import { ForgotTINComponent } from "./forgot_tin/forgot.component";
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedComponentsModule,
		AuthRoutingModule,
		SharedPipesModule,
		SharedDirectivesModule,
		ReCaptchaModule.forRoot({
			invisible: {
				sitekey: "6Ldbli0bAAAAANKOZ49YCMRBPJtvkZ9zqBGfug5z",
			},
			normal: {
				sitekey: "6Ldbli0bAAAAANKOZ49YCMRBPJtvkZ9zqBGfug5z",
			},
			language: "en",
		}),
	],
	declarations: [
		ForgotComponent,
		SigninComponent,
		PasswordComponent,
		ForgotEmailComponent,
		ForgotTINComponent,
		ConfirmEqualValidatorDirective,
	],
})
export class AuthModule {}
