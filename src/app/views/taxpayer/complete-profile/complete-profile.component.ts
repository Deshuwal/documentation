import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "../../../shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { DropdownDataService } from "../../../shared/services/dropdown-data.service";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-complete-profile",
	templateUrl: "./complete-profile.component.html",
	styleUrls: ["./complete-profile.component.scss"],
})
export class CompleteProfileComponent implements OnInit {
	formBasic: FormGroup;
	loading: boolean;
	radioGroup: FormGroup;

	config = {
		search: true,
		limitTo: 10,
		placeholder: "Select",
		noResultsFound: "No results!",
	};

	public maxDate = new Date().toISOString().split("T")[0];
	statuses = this.dropdownDataService.statuses;
	employement_statuses: string[] = [
		"Student",
		"Employed",
		"Unemployed",
		"Self-Employed",
	];
	countries: string[] = this.dropdownDataService.countries;
	public states: string[] = this.dropdownDataService.states;
	public lgas: string[] = [];
	occupations: string[];

	constructor(
		private fb: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private httpService: HttpService,
		private breadcrumb: BreadcrumbService,
		private dropdownDataService: DropdownDataService,
		private headTitle: Title
	) {}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	ngOnInit() {
		this.dropdownDataService.fetchOccupations().subscribe(
			(occupations: { name: string }[]) =>
				(this.occupations = occupations.map((occupation) => occupation.name)),
			(err) => (this.occupations = [])
		);
		this.dropdownDataService.fetchStatus().subscribe(
			(statuses: { name: string }[]) =>
				(this.statuses = statuses.map((status) => status.name)),
			(err) => (this.statuses = [])
		);
		this.headTitle.setTitle("Complete Profile");
		this.breadcrumb.setCrumbItem("dashboardCompleteProfile");
		this.buildFormBasic();
		this.radioGroup = this.fb.group({
			radio: [],
		});
	}

	buildFormBasic() {
		var userProfile = JSON.parse(localStorage["user"]);
		this.formBasic = this.fb.group({
			first_name: ["", Validators.required],
			surname: ["", Validators.required],
			other_names: ["", Validators.required],
			state: ["", Validators.required],
			lga: ["", Validators.required],
			address: ["", Validators.required],
			email: ["", Validators.required],
			phone: ["", Validators.required],
			occupation: ["", Validators.required],
			title: ["", Validators.required],
			bvn: ["", Validators.required],
			gender: ["", Validators.required],
			office_number: ["", Validators.required],
			marital_status: ["", Validators.required],
			dob: ["", Validators.required],
			soo: ["", Validators.required],
			payer_address: ["", Validators.required],
			emp_status: ["", Validators.required],
			home_town: ["", Validators.required],
			nationality: ["", Validators.required],
		});

		this.formBasic.patchValue({
			...userProfile,
			title: userProfile.title_string,
			address: userProfile.payer_address,
			dob: this.parseISOString(userProfile.dob),
		});
	}

	parseISOString(s) {
		var b = s.split(/\D+/);
		return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
	}

	onSubmit() {
		this.loading = true;
		this.httpService
			.doPost("/users/update_profile", this.formBasic.value)
			.subscribe(
				(success) => {
					console.log({ success });
					this.loading = false;
					this.toastr.success("Profile updated.", "Success!", {
						progressBar: true,
					});

					this.router.navigateByUrl("/taxpayer/home");
				},
				(error) => {
					console.log({ error });
					this.httpService.displayServerValidautionErrors(error);

					this.loading = false;
				}
			);
	}

	getSelectedState() {
		this.lgas = this.dropdownDataService.getSelectedLga(
			this.formBasic.value.state
		);
	}
}
