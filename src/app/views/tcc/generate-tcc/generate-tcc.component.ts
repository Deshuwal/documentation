import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";

@Component({
	selector: "app-generate-tcc",
	templateUrl: "./generate-tcc.component.html",
	styleUrls: ["./generate-tcc.component.scss"],
	animations: [SharedAnimations],
})
export class GenerateTccComponent implements OnInit {
	loading = false;
	TCCForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private dl: HttpService,
		private toastService: ToastrService,
		private breadcrumb: BreadcrumbService,
		private httpService: HttpService
	) {}

	ngOnInit() {
		this.TCCForm = this.fb.group({
			tin: ["", Validators.required],
			full_name: ["", Validators.required],
			email: [""],
			address: ["", Validators.required],
			income_source: ["", Validators.required],
			expiry_date: ["", Validators.required],
			rank: [""],
			sector: ["Formal"],
			payments: new FormArray([]),
		});

		this.TCCForm.get("tin").valueChanges.subscribe((selectedValue) => {
			const tin = this.TCCForm.get("tin").value;

			if (String(tin).length > 8) {
				this.httpService
					////.doGet("users/get_user_by_tin/" + tin)
					.doGet("users/get_user_or_company_by_tin/" + tin)
					.subscribe((res: any) => {
						if (!res.data) {
							this.TCCForm.patchValue(
								{ rank: "", full_name: "", email: "", address: "" },
								{ emitEvent: false }
							);
							this.toastService.error(
								"The user's TIN does not exist! Please, try a valid TIN",
								"Error",
								{ timeOut: 10000, closeButton: true, progressBar: true }
							);
							return;
						}
						const profile = res.data;
						this.TCCForm.patchValue(
							{
								rank: profile.title || profile.title_string,
								full_name:
									profile.first_name || profile.other_names || profile.surname
										? `${profile.first_name} ${profile.other_names || ""} ${
												profile.surname
										  }`
										: profile.name || profile.company_name,
								email: profile.email || profile.office_email,
								address: profile.address
									? profile.address
									: profile.payer_address,
							},
							{ emitEvent: false }
						);
					});
			}
		});

		this.t.push(
			this.fb.group({
				year: [""],
				tax_payabe: [""],
				total_income: [""],
				chargeable_income: [""],
				tax_paid: [""],
				receipt_no: [""],
			})
		);

		this.breadcrumb.setCrumbItem("Generate Tcc");
	}

	// convenience getters for easy access to form fields
	get f() {
		return this.TCCForm.controls;
	}
	get t() {
		return this.f.payments as FormArray;
	}

	onAddPaymentForm() {
		this.t.push(
			this.fb.group({
				year: [""],
				tax_payabe: [""],
				total_income: [""],
				chargeable_income: [""],
				tax_paid: [""],
				receipt_no: [""],
			})
		);
	}

	loadingTCC = false;
	btnText = this.loadingTCC ? "Please wait ..." : "Generate TCC";
	submitted = false;
	OnTccSubmit() {
		this.loadingTCC = true;
		this.submitted = true;

		if (this.TCCForm.valid) {
			const body = {
				...this.TCCForm.value,
				payments: JSON.stringify(this.TCCForm.value.payments),
			};

			this.dl.doPost("/tcc/add", body).subscribe(
				(res) => {
					this.toastService.success("TCC application sent for approval");
					this.TCCForm.reset();
					this.t.clear();
					this.loadingTCC = false;
					this.submitted = false;
				},
				(err) => {
					console.log({ err });
					this.toastService.error("An error occured!");
					this.loadingTCC = false;
					this.submitted = false;
				}
			);
		}
		this.loadingTCC = false;
	}
}
