//this is the entry point of the this module (route path) 
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";  
import { SignupwtComponent } from "./userwithtin/signupwt.component"; 
import { SignupwtJTBComponent } from "./userwithjtbtin/signupwtjtb.component";
import { SignupwtNINComponent } from "./userwithnin/signupwtnin.component";

const routes: Routes = [
  {
    path: "signup/:strategy",
    component: SignupComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  
  {
    path: "userwithtin",
    component: SignupwtComponent,
  },
  

  {
    path: "userwithjtbtin",
    component: SignupwtJTBComponent,
  },

  {
    path: "userwithnin",
    component: SignupwtNINComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
