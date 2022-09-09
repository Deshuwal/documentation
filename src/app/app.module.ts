import {NgbDateAdapter, NgbDateNativeAdapter} from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./shared/inmemory-db/inmemory-db.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ManageUserService } from "./views/mda-admin/manage_users/manage-user.service";
import { AuditActivityService } from "./views/audit/activity/activity.service";
import { UnauthorizedErrorInterceptor } from "./shared/inteceptors";
import { PrintUserPDF } from "./views/taxpayer/print-pdf/print-pdf.component";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive"; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from "angular2-moment"; //
import { NgHelmetModule } from "ng-helmet";
import { CsvModule } from "@ctrl/ngx-csv";
import { DropdownDataService } from "./shared/services/dropdown-data.service";
/**
 * @param  {[AppComponent]} is a declered parameter
 * @param  {[InMemoryWebApiModule.forRoot(InMemoryDataService} is an imports
 * @param  {true} boolean parameter
 * @param  {} CsvModule
 * @param  {} BrowserModule
 * @param  {} SharedModule
 * @param  {} MomentModule
 * @param  {} HttpClientModule
 * @param  {} BrowserAnimationsModule
 * @param  {} AppRoutingModule
 * @param  {} NgIdleKeepaliveModule.forRoot
 * @param  {} NgHelmetModule.forRoot
 */
@NgModule({
	declarations: [AppComponent],
	imports: [
		InMemoryWebApiModule.forRoot(InMemoryDataService, {
			passThruUnknownUrl: true,
		}),
		CsvModule,
		BrowserModule,
		SharedModule,
		MomentModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		NgIdleKeepaliveModule.forRoot(),
		NgHelmetModule.forRoot({})

	],
	providers: [
		Title,
		{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: UnauthorizedErrorInterceptor,
			multi: true,
		},
		ManageUserService,
		AuditActivityService,
		PrintUserPDF,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
