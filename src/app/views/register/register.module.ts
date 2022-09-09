import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"; 
import { SessionsRoutingModule } from "./register-routing.module";
import { SignupComponent } from "./signup/signup.component";  
import {SignupwtComponent} from "./userwithtin/signupwt.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";  
import { SignupwtJTBComponent } from "./userwithjtbtin/signupwtjtb.component";

import { SignupwtNINComponent } from "./userwithnin/signupwtnin.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SessionsRoutingModule,
  ],
  declarations: [
    SignupComponent,  
    SignupwtComponent,
    SignupwtJTBComponent,
    SignupwtNINComponent
  ],
})
export class RegisterModule {}
