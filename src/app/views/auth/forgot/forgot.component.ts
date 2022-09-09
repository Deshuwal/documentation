import { Component, OnInit } from "@angular/core";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";

import {
	Router,
	RouteConfigLoadStart,
	ResolveStart,
	RouteConfigLoadEnd,
	ResolveEnd,
} from "@angular/router";
import { HttpService } from "src/app/shared/services/http.service";

@Component({
	selector: "app-forgot",
	templateUrl: "./forgot.component.html",
	styleUrls: ["./forgot.component.scss"],
	animations: [SharedAnimations],
})
export class ForgotComponent implements OnInit {
	public stage: number = 1;

	public loading: boolean;
	public loadingText: string = "Requesting...";
	public forgotForm: FormGroup;

	// verification_code: string = '';
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private toastService: ToastrService,
		private httpService: HttpService
	) {}

	ngOnInit() {
		this.forgotForm = this.fb.group({
			phone: [""],
			code: [],
			password: [],
			confirm_password: [],
		});
	}

	sendResetRequest() {
		this.loading = true;
		// this.loadingText = 'Reseting password. Please Wait...';
		const phoneNumber = this.forgotForm.value.phone.trim();

		if (!phoneNumber.length) {
			this.loading = false;
			// this.loadingText = '';
			this.toastService.error("Valid phone number is required.");
			return;
		}

		this.httpService.doGet(`auth/reset_password/${phoneNumber}`).subscribe(
			(res: any) => {
				this.loading = false;

				this.forgotForm.patchValue({ phone: "" });

				this.toastService.success(res.message, "Successful", {
					timeOut: 60000,
					closeButton: true,
					progressBar: true,
				});

				// setTimeout(() => {
				//   this.router.navigateByUrl('/auth/signin');
				// }, 10000);
			},
			(error) => {
				this.loading = false;
				let message =
					error.status == 0
						? "Connection failed. Please retry!"
						: error.error.message;
				if (error.status == 200) {
					message = "Unexpected error occured. Please retry!";
				}
				this.toastService.error(message, "Error!");
			}
		);
	}
}
