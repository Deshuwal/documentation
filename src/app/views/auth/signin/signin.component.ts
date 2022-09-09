/** 
 * @ignore
*/
import {
	Component,
	ElementRef,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
} 
/**
 * @ignore
 */
from "@angular/core";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators, NgModel } from "@angular/forms";
import { AuthService } from "../../../shared/services/auth.service";
import { ToastrService } from "ngx-toastr";
import {
	Router,
	RouteConfigLoadStart,
	ResolveStart,
	RouteConfigLoadEnd,
	ResolveEnd,
} 
from "@angular/router";
import { fromEvent } from "rxjs";
import {
	filter,
	debounceTime,
	distinctUntilChanged,
	tap,
} from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { HttpService } from "src/app/shared/services/http.service";
import { RoleHome } from "src/app/shared/models/role-home";
import { LocalStorage } from "@ng-idle/core";
/**
 * ignore
 */
@Component({
	selector: "app-signin",
	templateUrl: "./signin.component.html",
	styleUrls: ["./signin.component.scss"],

	animations: [SharedAnimations],
})
/**
 * variables
 */
export class SigninComponent implements OnInit {
	loading: boolean;
	confirmResut;
	loadingText: string;
	signinForm: FormGroup;
	verificationForm: FormGroup;
	display_modal: boolean = true;
	closeResult = "";
	
	/**
	 * @param  {} "billref" parameter for bill referencing 
	 * @param  {} "Tinref" paramenter for tin referencing
	 * @returns any
	 */
	@ViewChild("billref", { static: false }) input: ElementRef;
	@ViewChild("TinRef", { static: false }) TinRef: ElementRef;
	@ViewChild("phone", { static: false }) phoneInput: ElementRef;
	@ViewChild("billRefModal", { static: false }) assessmentModal: TemplateRef<any>;
	@ViewChild("phoneModal", { static: false }) phoneModal: TemplateRef<any>;
	@ViewChild("recaptchaModal", { static: false })
	recaptchaModal: TemplateRef<any>;
	@ViewChild("coyRegModal", { static: false }) coyRegModal: TemplateRef<any>;
	@ViewChild("recaptcha", { static: true }) recaptchaElement: ElementRef;
	showModal: boolean = false;
	@ViewChild("acceptTerms", { static: true }) private acceptTermsModal;
	@Input() assessment = {};
	@Input() phones: any[];
	loadingBillrEF = false;
	loadingTinrEF = false;
	loadingPhone = false;

	constructor(
		private fb: FormBuilder,
		private navService: NavigationService,
		private auth: AuthService,
		private router: Router,
		private toastService: ToastrService,
		private modalService: NgbModal,
		private dl: HttpService,
		private title: Title,
		private localstore: LocalStorage
	) {}

	onCaptchaResponse(token: string) {

		this.doVerification();
		
	/*	if (token) {
			this.closeModal();
			if (this.input.nativeElement.value) {
				this.searchBillRefAll();
			} 
			else if (this.phoneInput.nativeElement.value) {
				this.searchAccount();
			} else if (this.TinRef.nativeElement.value) {
				this.searchTinAccount();
			}
		} else {
			return;
		} */
	}

	fieldTextType: boolean;
	brnType: string;

	verification_placeholder:string = "";
	verification_mode:boolean = false;


	toggleVerificationMode(){
		this.verification_mode = !this.verification_mode;
	}
	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}

	loadTermsOfUse() {
		this.modalService.open(this.acceptTermsModal);
	}

	acceptTermsOfUse() {
		this.modalService.dismissAll();
		this.localstore.setItem("showTerms", null);
	}

	parseDate(date: string) {
		const res = new Date(+date * 1000);
		console.log({ res });
		return res.toISOString().substring(0, 10);
	}

	formatDbDate(date: string){
		let part = date.split(" ")[0];
		return part;
	}
	/**
	 * @param  {} {this.title.setTitle("Login"
	 * @param  {} ;this.router.events.subscribe((event
	 * @param  {} =>{eventinstanceofRouteConfigLoadStart||eventinstanceofResolveStartthis.loadingText="Loadingyourdashboard...";this.loading=true;this.loading=true;}
	 */
	ngOnInit() {
		this.title.setTitle("Login");
		this.router.events.subscribe((event) => {
			//if (
				event instanceof RouteConfigLoadStart ||
				event instanceof ResolveStart
			//) {
				this.loadingText = "Loading your dashboard...";

				this.loading = true;
		//	}
		//	if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
				this.loading = true;
	//		}
		});

		this.signinForm = this.fb.group({
			user: ["", Validators.required],
			password: ["", Validators.required],
		});

		this.verificationForm = this.fb.group({
			v_type: ["", Validators.required],
			v_input: ["", Validators.required],
		});
	}

	openCaptcha(){

		let values:any = this.verificationForm.controls;

		console.log(values, "is values");

		if (values.v_type.status == "INVALID") {
			this.showError(
				"Invalid Input",
				"Please select verification type"
			);
			return;
		}

		if (values.v_input.status == "INVALID") {
			this.showError("invalid input", "Please enter value to search");
			return;
		}


		this.open(this.recaptchaModal);
	}

	setVerificationPlaceholder(){

		switch(this.verificationForm.value.v_type){

			case "phone":
				this.verification_placeholder ="Enter Phone No";
				break;

			case "brn":
				
				this.verification_placeholder ="Enter Billing Ref";
				break;

			case "tin":
				
				this.verification_placeholder ="Enter TIN No";
				break;

		}
	}
	doVerification(){

		switch(this.verificationForm.value.v_type){

			case "phone":
				this.searchAccount(this.verificationForm.value.v_input);
				break;

			case "brn":
				this.searchBillRef(this.verificationForm.value.v_input);
				break;

			case "tin":
				this.searchTinAccount(this.verificationForm.value.v_input);
				break;

		}

 
	}

	searchBillRefAll(elemVal:string){
		//let elemVal:string = this.input.nativeElement.value;
		var refCode = elemVal.substring(0,5); 
		if(refCode === "N-BRN"){
			this.searchBillRef(elemVal);
		}else if(refCode === "N-LGC"){
			this.searchBillLgcRef(elemVal);
		}
	}

	searchBillRef(brn) {
		this.loadingBillrEF = true;
		this.brnType = "BRN";
		this.dl
			.doGet(
				`/verification/assessment_status/${brn}`
			)
			.subscribe(
				(res: any) => {
					if (res.status == "failure") {
						this.toastService.error(res.message, "Not Found !", {
							timeOut: 10000,
						});
					}
					if (res.status == "success") {
						this.assessment = res.assessment;
						this.open(this.assessmentModal);
					}
					this.loadingBillrEF = false;
				},
				(err) => {
					console.log({ err });
					this.toastService.error("Please try again", "Error", {
						timeOut: 10000,
					});
					this.loadingBillrEF = false;
				}
			);
	}

	//evans new add
	searchBillLgcRef(brn:string) {
		this.loadingBillrEF = true;
		this.brnType = "LGC";
		this.dl
			.doGet(
				`/lgc_revenues/lgc_revenue_status/${brn}`
			)
			.subscribe(
				(res: any) => {
					if (res.status == "failure") {
						this.toastService.error(res.message, "Not Found !", {
							timeOut: 10000,
						});
					}
					if (res.status == "success") {
						this.assessment = res.lgc_revenue;
						this.open(this.assessmentModal);
					}
					this.loadingBillrEF = false;
				},
				(err) => {
					console.log({ err });
					this.toastService.error("Please try again", "Error", {
						timeOut: 10000,
					});
					this.loadingBillrEF = false;
				}
			);
	}

	searchTinAccount(tin:string) {
		this.loadingTinrEF = true;

		this.dl;
		this.dl
			.doGet("/users/search_tins?tin=" + tin)

			.subscribe(
				(res: any) => {
					if (res.status == "success" && res.data.length < 1) {
						this.toastService.error(
							"No account is associated with this TIN",
							"Not Found !",
							{
								timeOut: 10000,
							}
						);
					}
					if (res.status == "success" && res.data.length > 0) {
						console.log("inside");
						this.phones = res.data;
						this.open(this.phoneModal);
					}
					this.loadingTinrEF = false;
				},
				(err) => {
					console.log({ err });
					this.toastService.error("Please try again", "Error", {
						timeOut: 10000,
					});
					this.loadingTinrEF = false;
				}
			);
	}

	searchAccount(phone:string) {
		this.loadingPhone = true;

		this.dl
			.doPost(`verification/check_user_exists`, {
				phones: phone,
			})
			.subscribe(
				(res: any) => {
					if (res.status == "success" && res.data.length < 1) {
						this.toastService.error(
							"No account is associated with this phone number",
							"Not Found !",
							{
								timeOut: 10000,
							}
						);
					}
					if (res.status == "success" && res.data.length > 0) {
						console.log("inside");
						this.phones = res.data;
						this.open(this.phoneModal);
					}
					this.loadingPhone = false;
				},
				(err) => {
					console.log({ err });
					this.toastService.error("Please try again", "Error", {
						timeOut: 10000,
					});
					this.loadingPhone = false;
				}
			);
	}

	 

	openCompanyRegModal() {
		console.log("called!");
		this.open(this.coyRegModal);
	}

	signin() {
		let values = this.signinForm.controls;

		if (values.user.status == "INVALID") {
			this.showError(
				"Invalid Input",
				"Please enter valid TIN, Phone number, or NIN"
			);
			return;
		}

		if (values.password.status == "INVALID") {
			this.showError("Invalid Password", "Password is required");
			return;
		}

		this.loading = true;
		this.loadingText = "Signing in...";
		this.auth
			.signin(this.signinForm.value)
			.then((res: any) => {
				if (res.status == "success" && res.data) {
					localStorage["token"] = res.data.token;
					const role = parseInt(res.data.user.role);
					console.log("user-after-login", res.data.user)
					this.router.navigateByUrl(RoleHome[role]);
					return;
				}
				throw new Error("Please make sure your TIN and Password are correct");
			})
			.catch((err) => {
				console.log(err);
				let title;
				let message;
				this.loading = false;
				this.loadingText = "Sign In";
				if (err.error && err.error.message && err.status == 401) {
					return this.showError(
						"",
						"Phone or TIN or password or combination of both is incorrect"
					);
				}
				title = "Error";
				message = "Connection failed. Try again";

				this.showError(title, message);
			});
	}

	openUrl(url: string) {
		this.router.navigateByUrl(url);
	}

	openPortal(role: string) {
		this.navService.setUserMenu(role);
		localStorage["portal"] = role;
		this.modalService.dismissAll("");

		this.router.navigateByUrl("/taxpayer/home");
	}

	showError(errSubject: string, errMsg: string) {
		this.toastService.error(errMsg, errSubject, { timeOut: 10000 });
	}

	open(content) {
		this.modalService
			.open(content, { ariaLabelledBy: "modal-basic-title" })
			.result.then(
				(result) => {
					this.closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);
	}

	closeModal() {
		this.modalService.dismissAll();
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return "by pressing ESC";
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return "by clicking on a backdrop";
		} else {
			return `with: ${reason}`;
		}
	}
}

function counttimer() {
	var countDownDate = new Date();
	if (
		localStorage.getItem("timecheck") == "" ||
		localStorage.getItem("timecheck") == null
	) {
		countDownDate.setMinutes(countDownDate.getMinutes() + 10);
		localStorage.setItem("duetime", countDownDate + "");
	} else {
		countDownDate.setMinutes(
			new Date(localStorage.getItem("duetime")).getMinutes(),
			0
		);
	}

	var x = setInterval(function () {
		var now = new Date().getTime();
		var distance = countDownDate.getTime() - now;
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		localStorage.setItem("timecheck", minutes + "m " + seconds + "s ");
		console.log(localStorage.getItem("timecheck"));

		if (distance < 0) {
			clearInterval(x);
			localStorage.removeItem("timecheck");
		}
	}, 1000);
}
