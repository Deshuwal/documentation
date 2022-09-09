import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { PasswordComponent } from "./password/password.component";
import { ForgotEmailComponent } from "./forgot_email/forgot.component";
import { ForgotTINComponent } from "./forgot_tin/forgot.component";

const routes: Routes = [
	{
		path: "signin",
		component: SigninComponent,
	},
	{
		path: "forgot",
		component: ForgotComponent,
	},
	{
		path: "forgot_email",
		component: ForgotEmailComponent,
	},
	{
		path: "forgot_tin",
		component: ForgotTINComponent,
	},
	{
		path: "password/:ref",
		component: PasswordComponent,
	},
	{
		path: "",
		redirectTo: "signin",
		pathMatch: "full",
	},
];
/**
 * @param  {RouterModule.forChild(routes)} enable the route to link to the main route
 * @returns RouterModule
 */
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
