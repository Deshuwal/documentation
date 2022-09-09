//importation of addtional functionality for the signup module to function effectively
import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd,
} from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../shared/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "../../../shared/services/http.service";

import { ActivatedRoute } from "@angular/router";
import { TinService } from "src/app/shared/services/tinservice";
import { error } from "protractor";

//this show the template location and the view path
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [SharedAnimations],
})
//what is on this oninit component method is going to be visiable on the template view display
export class SignupComponent implements OnInit {
  //setting array veriables to with a public access modifiers 
  public profile_types = ["Corporate", "Individual"];
  public industries = ["Construction", "Education", "Energy"];
  public marital_status = ["Single", "Married", "Divorced", "Widowed"];

  //uses an angular decorator to set the password variable condition for the viewchild template
  @ViewChild("confirm_password", { static: false }) confirm_password: any;

  //this set and array of string variables 
  public employment_statuses = ["Employed", "Unemployed", "Self Employed", "Retired", "Student","Others",];
  public genders = ["Male", "Female"];

  public countries = ["Nigeria", "Ghana", "Togo"];
  
  public page_title: string = "Sign Up!";
  
  public new_tin: string = "";
  
  public registration_response = "";

  public finished_registration: boolean = false;

  loading: boolean;
  loadingText: string;

  public states: any[] = [];
 
  
  public lgas: any[] = [];

  NIN_registration: boolean = false;
  signupForm: FormGroup;//this shows that the form belongs to an angular form ngmodule 

//this where all the injectable dependencies design by the programmer are initialized
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private auth: AuthService,
    private tinService: TinService,
    private router: Router,
    private toastService: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  //this method in particular make contain visiable on the view template 
  ngOnInit() {
    //this part is used to set form validiation from the view template
    this.signupForm = this.fb.group({
      first_name: ["", Validators.required],
      surname: ["", Validators.required],
      phone: ["", [Validators.minLength(11), Validators.required]],
      password: ["", Validators.required],
      state: ["Plateau", Validators.required],
      lga: ["", Validators.required],
      nin: ["", Validators.minLength(11)],
      confirm_password: ["", Validators.required],
    });

    //this checks the route pattern of the signup module
    this.route.params.forEach((e: any) => {
      if (e.strategy) {
        switch (e.strategy) {
          case "nin":
            this.NIN_registration = true;
            break;
        }
      }
    });
    //this var declaration value is obtain from a service of auth.servce.ts and it injected
    var isNINReg = localStorage["nin_reg"];
    if (isNINReg) {
      this.NIN_registration = isNINReg;
    }

    //this method settimeout is also an injected method form json assets which is define by system 
    setTimeout(() => {
      this.loadJsonAssets();
    }, 2000);
  }
  fieldTextType: boolean;

  //this set a toggle method for the field type 
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  //calling a json contains the state and status file as string from asset folder which is been injected into the file 
  loadJsonAssets() {
    let statesFile: string = "../../../../assets/data/state.json";
    let lgaFiles: string = "../../../../assets/data/status.json";

    //setting a http injection for data retieval from the db of states 
    this.httpService.getDataHttp(statesFile).subscribe((data: any[]) => {
      var testResponse = data;
      this.states = data;
      this.getSelectedState();
    });
  }

  //this method is used the set a selected state by user upon loading from the db by the above method
  getSelectedState() {
    let stateSelected = this.signupForm.value.state;
    console.log("selected state ", stateSelected);
    let stateObject: any = null;

    //this forloop loop through the state retieve and return the state that is selected by user a valid 
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].state === stateSelected) {
        stateObject = this.states[i];
      }
    }

    //this selected state return by the function contain an object of its LGAs within it
    this.fetchLGAs(stateSelected);
    return stateObject;
  }

  //this method is possible base on the validity of the above method call
  fetchLGAs(selectedState) {
    console.log("fetching lga for ", selectedState);
    this.states.map((state) => {
      if (state.state === selectedState) {
        console.log("set lga");
        this.lgas = state.lgas;
      }
    });
  }

  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getPreTin() {
    let state: string = this.signupForm.value.state;
    let lga: string = this.signupForm.value.lga;
    let pre_tin = "23";

    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].state == state) {
        for (let j = 0; j < this.states[i].lgas.length; j++) {
          let thisLga: string = this.states[i].lgas[j];

          if (thisLga == lga) {
            let pre_state = this.pad(i, 2, "0");
            let pre_lga = this.pad(j, 2, "0");
            pre_tin = pre_tin + pre_state + pre_lga;
          }
        }
      }
    }

    return pre_tin;
  }

  signUp() {
    let values = this.signupForm.controls;
    console.log(this.signupForm.value);

    if (this.NIN_registration && !values.nin.value) {
      this.showError("Error", "NIN field is required");
      return;
    }

    if (this.NIN_registration) {
      if (values.nin.status == "INVALID") {
        this.showError("Error", "Invalid NIN");
        return;
      }
    }

    if (values.first_name.status == "INVALID") {
      this.showError("Error", "First Name Field is required");
      return;
    }

    if (values.state.status == "INVALID") {
      this.showError("Error", "State Field is required");

      return;
    }

    if (values.lga.status == "INVALID") {
      this.showError("Error", "LGA Field is required");
      return;
    }

    if (values.surname.status == "INVALID") {
      this.showError("Error", "Surname Field is required");
      return;
    }

    if (values.phone.status == "INVALID") {
      this.showError(
        "Phone field is required",
        "Invalid phone number. Must be upto 11 digits"
      );
      return;
    }

    if (values.password.status == "INVALID") {
      this.showError("Invalid Password", "Password is required");
      return;
    }

    if (!this.checkPassword()) {
      this.showError(
        "Invalid Password",
        "Password must be more than 5 characters long"
      );
      return;
    }

    if (
      this.signupForm.value.password != this.signupForm.value.confirm_password
    ) {
      this.showError("Error", "Password and confirm password do not match");
      return;
    }

    this.doSignUp();
  }

  public beginPasswordCheck: boolean = false;
  setupPasteWatch() {
    this.beginPasswordCheck = true;

    let win: any = window;

    win.preventPaste("confirm_password", this);
    win.strengthWatch("password");
  }

  checkPassword() {
    if (this.signupForm.value.password) {
      const matches = this.signupForm.value.password.length > 5;
      return matches ? true : false;
    } else {
      return false;
    }
  }

  showError(errSubject: string, errMsg: string) {
    this.toastService.error(errMsg, errSubject, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    });
  }

  signup_result: any;
  private doSignUp() {
    let pre_tin = this.tinService.getPreTin(
      this.signupForm.value.state,
      this.signupForm.value.lga
    );

    this.loadingText = "Registering ...";
    this.loading = true;

    var body = this.signupForm.value;
    body.source = "self-reg";

    body.pre_tin = pre_tin;

    this.httpService.doPost("users/register", body).subscribe(
      (res: any) => {
        this.loading = false;
        this.loadingText = "Sign up";

        if (res.code == 400) {
          this.toastService.warning(res.error_message, res.error_subject, {
            timeOut: 10000,
            closeButton: true,
            progressBar: true,
          });
        } else if (res.status=="success") {
          this.toastService.success(res.message, "Success!", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });

          this.finished_registration = true;
          this.registration_response = res.message;

       
        }
        else{ 
          this.toastService.warning("Network error", "Network Error", {
            timeOut: 10000,
            closeButton: true,
            progressBar: true,
          });
        }
      },
      (error) => {
        this.loading = false;
        this.loadingText = "Sign up";
        this.httpService.displayServerValidautionErrors(error);
      }
    );
  }

  private confirmResut: string;

  confirm(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => {
          this.confirmResut = `Closed with: ${result}`;
        },
        (reason) => {
          this.confirmResut = `Dismissed with: ${reason}`;
        }
      );
  }

  openLogin() {
    this.router.navigateByUrl("/auth/signin");
  }
}
