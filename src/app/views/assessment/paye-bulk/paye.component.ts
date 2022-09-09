import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { Component, OnInit } from "@angular/core";
import { LocalStoreService } from "../../../shared/services/local-store.service";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
import { Router } from "@angular/router";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { PayeeCalculator } from "src/app/shared/models/payee_calculator";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { currentId } from "async_hooks";
@Component({
	selector: "app-dashboad-default",
	templateUrl: "./paye.component.html",
	styleUrls: ["./paye.component.css"],
	animations: [SharedAnimations],
})
export class PayeComponent implements OnInit {
	file: any;
	userProfile: any;
	exceltoJson = [];
	isExcelFile: boolean;
	failed: number = 0;
	successful: number = 0;
	public done: boolean = false;
	public payeeForm: FormGroup;
	public loading: boolean = false;
	selectedCompanyData: any;
	companyTin: any;

	private keys = {
		tin: "TIN",
		name: "Name",
		phone: "Phone",
		dev_levy: "Developement Levy",
		basic_monthly_salary: "Basic Salary",
		housing: "Housing",
		transport: "Transport",
		others: "Others",
		// thirteenth_month_salary: "13th Month Salary",
		// official_accomodation: "Official Accommodation",
		// official_vehicle: "Official Vehicle",
		pension: "Pension",
		nhf: "NHF",
		nhis: "NHIS",
		life_premium: "Life Premium",
		consolidated_amount: "consolidated amount",
		mortgage: "Mortgage",
		voluntary_pension_contribution: "Voluntary Contribution",
		deduction_voluntary_contribution_percentage: "Percentage if yes",
		is_consolidated: "is_cons",
	};

	constructor(
		private localStore: LocalStoreService,
		private toastrService: ToastrService,
		private dl: HttpService,
		private fb: FormBuilder,
		private breadcrumb: BreadcrumbService,
		private router: Router,
		private assessmentService: AssessmentService
	) {}

	ngOnInit() {
		this.userProfile = this.localStore.getItem("user");
		this.breadcrumb.setCrumbItem("assessmentPaye");

		this.payeeForm = this.fb.group({
			mda_id: [""],
			tax_item_id: [""],
			bulk_name: ["", Validators.required],
			period_from: ["", Validators.required],
			period_to: ["", Validators.required],
		});

		this.payeeForm.patchValue({ mda_id: 3, tax_item_id: 13 });
		// this.validateUserTinExist(2331058689);
	}

	fileChanged(e) {
		this.file = e.target.files[0];
	}

	submit() {
		// let data, header;
		if (!this.file) {
			this.toastrService.error("You must select a file.");
			return;
		}

		if (!this.file.name.match(/(.xls|.xlsx)/)) {
			this.toastrService.error(
				"Invalid file format selected. Please select an excel file."
			);
			return;
		}

		if (!this.payeeForm.value.period_from.trim().length) {
			this.toastrService.error("Starting period is required");
			return;
		}

		if (!this.payeeForm.value.period_to.trim().length) {
			this.toastrService.error("Ending period is required");
			return;
		}

		this.loading = true;
		const reader: FileReader = new FileReader();
		reader.readAsBinaryString(this.file);
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];
			/* save data */
			this.exceltoJson = XLSX.utils.sheet_to_json(ws);
		};

		reader.onloadend = (e) => {
			this.loading = false;
			this.companyTin = this.exceltoJson[0].TIN;
			this.getCompanyData(this.companyTin);
		};
	}

	getCompanyData(companyTin: any) {
		this.loading = true;
		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doGet("users/company_by_tin/" + companyTin)
			.subscribe(
				(res: any) => {
					this.loading = false;
					this.selectedCompanyData = res.data;
					this.saveBulkRecord();
				},
				(err) => {
					this.loading = false;
					this.toastrService.error(
						"An error occured... Please verify that the company TIN is correct"
					);
				}
			);
	}

	saveBulkRecord() {
		this.loading = true;
		let timeStamp = this.getTimeStamp();
		let total_dev_levy = this.exceltoJson.reduce((acc, cur) => {
			if (
				cur["Developement Levy"] &&
				typeof cur["Developement Levy"] == "string" &&
				cur["Developement Levy"].toLowerCase() == "yes"
			) {
				return acc + 300;
			}
			return acc + 0;
		}, 0);

		const record = {
			mda_id: 3,
			tax_item_id: 13,
			mda_name: "PSIRS",
			employee_no: this.exceltoJson.length,
			total_dev_levy,
			// bulk_name: this.generateBulkName(this.payeeForm.value, this.selectedCompanyData.company_name.trim()),
			bulk_name: `${this.selectedCompanyData.company_name.trim()}-${
				this.payeeForm.value.period_from
			}-to-${this.payeeForm.value.period_to}`,
			period_from: this.payeeForm.value.period_from,
			period_to: this.payeeForm.value.period_to,
			organization_name: this.selectedCompanyData.company_name.trim(),
			organization_tin: this.companyTin,
			user_id: this.userProfile.id,
			bulk_id: this.makeRandom(10),
			bulk_assessment_id: this.makeRandom(8),
			record: this.exceltoJson.map((item: any) =>
				this.prepareAssessmentToSave(item)
			),
			created_by:
				this.userProfile.name != null
					? this.userProfile.name
					: `${this.userProfile.first_name} ${this.userProfile.surname}`,
		};

		console.log("bulkkkk recorddd", record);
		return this.dl.doPost("assessment/save_bulk", record).subscribe(
			(res: any) => {
				// this.processFile(res.data);
				this.loading = false;
				console.log("emily", res.data);

				this.toastrService.success(
					"PAYE Assessment succeeded... Proceed to payment..."
				);
				this.router.navigateByUrl("payment/bulk-paye-payments");
			},
			(err) => {
				this.loading = false;
				this.toastrService.error("An error occured... Please try again");
			}
		);
	}

	processFile(bulkData: any) {
		this.toastrService.info(`${this.exceltoJson.length} record(s) found.`);
		if (this.exceltoJson.length) {
			let completed = 0;
			this.failed = 0;
			this.successful = 0;
			this.loading = true;

			let bulk_id = bulkData.bulk_assessment_id;
			let bulk_paye_id = bulkData.id;
			let bulk_name = bulkData.bulk_name;

			this.payeeForm.patchValue({ bulk_name: "" });

			const payeFile = this.exceltoJson.forEach((item: any) => {
				let payeToSave: any = this.prepareAssessmentToSave(item);
				payeToSave = { ...payeToSave, bulk_name, bulk_id, bulk_paye_id };
			});

			// this.saveAssessment(payeFile, -1, "paye").subscribe(
			//   (res) => {
			//     // add response to log
			//     console.log("paye bulk response", res);
			//     this.handleDone();
			//   },
			//   (err) => {
			//     // add err to log
			//     completed += 1;
			//     this.failed += 1;
			//     if (completed == this.exceltoJson.length) {
			//       this.handleDone();
			//     }
			//   }
			// );
		}

		// this.exceltoJson.forEach((item: any) => {
		//   let payeToSave: any = this.prepareAssessmentToSave(item);
		//   payeToSave = { ...payeToSave, bulk_name, bulk_id, bulk_paye_id };

		//   // console.log('katsssssss payeToSave', payeToSave);
		//   this.saveAssessment(payeToSave, -1, "paye").subscribe(
		//     (res) => {
		//       // add response to log
		//       completed += 1;
		//       this.successful += 1;
		//       if (completed == this.exceltoJson.length) {
		//         this.handleDone();
		//       }
		//     },
		//     (err) => {
		//       // add err to log
		//       completed += 1;
		//       this.failed += 1;
		//       if (completed == this.exceltoJson.length) {
		//         this.handleDone();
		//       }
		//     }
		//   );
		// });
	}

	getIndividualEmployee(phone: any) {
		this.loading = true;
		this.dl
			// .doGet("users/get_user_by_tin/" + companyTin)
			.doGet("users/get_user_by_phone/" + phone)
			.subscribe(
				(res: any) => {
					this.loading = false;
					console.log("gottent user", res.data);
					// this.selectedCompanyData = res.data;
					// this.saveBulkRecord();
				},
				(err) => {
					this.loading = false;
					this.toastrService.error(
						"An error occured... Please verify that the company TIN is correct"
					);
				}
			);
	}

	prepareAssessmentToSave(item: any) {
		// console.log({ excel: item });
		const assess = {
			mda_id: 3,
			tax_item_id: 13,
			user_id: this.userProfile.id,
			payer_name: this.selectedCompanyData.company_name.trim(),
			payer_tin: item[this.keys.tin],
			period_from: this.payeeForm.value.period_from,
			period_to: this.payeeForm.value.period_to,
			created_by:
				this.userProfile.name != null
					? this.userProfile.name
					: `${this.userProfile.first_name} ${this.userProfile.surname}`,
			form_items: {
				tin: item[this.keys.tin],
				name: item[this.keys.name],
				income_basic_salary: item[this.keys.basic_monthly_salary],
				income_housing: item[this.keys.housing],
				income_transport: item[this.keys.transport],
				income_others: item[this.keys.others],
				deduction_pension: item[this.keys.pension],
				deduction_nhf: item[this.keys.nhf],
				deduction_nhis: item[this.keys.nhis],
				deduction_life_premium: item[this.keys.life_premium],
				deduction_voluntary_contribution:
					item[this.keys.voluntary_pension_contribution],
				deduction_voluntary_contribution_percentage:
					item[this.keys.deduction_voluntary_contribution_percentage],
				consolidated_amount: item[this.keys.consolidated_amount],
				nhf: item[this.keys.nhf],
				nhis: item[this.keys.nhis],
				is_consolidated: item[this.keys.is_consolidated],
				dev_levy: item[this.keys.dev_levy],
			},
			rules: {},
		};

		const pCalc = new PayeeCalculator();
		pCalc.CalculatePayee(assess.form_items);
		assess.rules = pCalc;
		return assess;
	}

	private saveAssessment(
		assessment: any,
		assessmentResult: any,
		assessmentType: string = "paye",
		pc: PayeeCalculator = null
	) {
		this.loading = true;
		assessment.rules =
			pc == null ? JSON.stringify(assessment.rules) : JSON.stringify(pc);
		assessment.form_items = JSON.stringify(assessment.form_items);
		assessment.amount = assessmentResult;
		assessmentType = assessmentType;
		return this.dl.doPost("/assessment/save", assessment);
	}

	private handleDone() {
		// this.registering = false;
		this.loading = false;
		this.toastrService.info(
			`${this.successful} successfully. ${this.failed} failed.`
		);
	}

	private makeRandom(lengthOfCode: number) {
		let text = "";
		const possible = "0123456789";
		for (let i = 0; i < lengthOfCode; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	generateBulkName(bulk_name: any, company_name: any) {
		let name = bulk_name.split("-");
		let month = name[1];
		var genName;
		let timeStamp = this.getTimeStamp();
		switch (month) {
			case "01":
				genName = company_name + "-january-" + timeStamp;
				break;
			case "02":
				genName = company_name + "-febuary-" + timeStamp;
				break;
			case "03":
				genName = company_name + "-march-" + timeStamp;
				break;
			case "04":
				genName = company_name + "-april-" + timeStamp;
				break;
			case "05":
				genName = company_name + "-may-" + timeStamp;
				break;
			case "06":
				genName = company_name + "-june-" + timeStamp;
				break;
			case "07":
				genName = company_name + "-july-" + timeStamp;
				break;
			case "08":
				genName = company_name + "-august-" + timeStamp;
				break;
			case "09":
				genName = company_name + "-september-" + timeStamp;
				break;
			case "10":
				genName = company_name + "-october-" + timeStamp;
				break;
			case "11":
				genName = company_name + "-november-" + timeStamp;
				break;
			case "12":
				genName = company_name + "-december-" + timeStamp;
				break;
			default:
				genName = company_name + bulk_name + "-" + timeStamp;
		}
		return genName;
	}

	getTimeStamp() {
		var now = new Date();
		return (
			now.getDate() +
			"-" +
			now.getFullYear() +
			"-" +
			now.getHours() +
			":" +
			(now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
			":" +
			(now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds())
		);
	}

	clickLink(id: string) {}
}
