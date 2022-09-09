import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { HttpService } from "./http.service";

@Injectable({
	providedIn: "root",
})
export class PaymentService {
	//Only for demo purpose
	authenticated = true;

	constructor(private httpService: HttpService, private router: Router) {
		this.checkAuth();
	}

	checkAuth() {
		// this.authenticated = this.store.getItem("demo_login_status");
	}

	payment(credentials: any) {
		return new Promise((resolve, reject) => {
			this.httpService.doPost("auth/login", credentials).subscribe(
				(success) => {
					this.authenticated = true;
					resolve(success);
				},
				(error) => {
					reject(error);
				}
			);
		});
	}
}
