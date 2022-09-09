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
  selector: "app-signupwt",
  templateUrl: "./signupwtnin.component.html",
  styleUrls: ["./signupwtnin.component.scss"],
  animations: [SharedAnimations],
})
export class SignupwtNINComponent implements OnInit {
  signupwtForm: FormGroup;
  signupwtpassForm: FormGroup;
  loading: boolean;
  loadingText: string = "";
  user_data:any = {};

  stage: number = 1;
  verification_code: string = "";
  phone: string = "";
  profile: any;

  public finished_registration: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.signupwtForm = this.fb.group({
      nin: [""],
    });

    this.signupwtpassForm = this.fb.group({
      password: [""],
      confirm_password: [""],
    });
  }


  convertNINProfileToPirasProfile(ninProfile){

    //@Todo the pre tin here is not accurate
    let piras_profile ={
      'first_name':ninProfile.firstname,
      'surname':ninProfile.surname,
      'other_names':ninProfile.middlename,
      'home_town': ninProfile.self_origin_lga,
      'nationality': "Nigeria",
      'gender':ninProfile.gender,
      'marital_status':ninProfile.maritalstatus,
      'soo':ninProfile.self_origin_state,
      'payer_address':ninProfile.residence_AdressLine1,
      'lga':ninProfile.residence_Town,
      'emp_status':ninProfile.emplymentstatus, 
      'dob': ninProfile.birthdate,
      'pre_tin':'233201',
      'occupation':ninProfile.profession,
      'phone':ninProfile.telephoneno,
      'email':ninProfile.email,
      'title':ninProfile.title,
      'nin': ninProfile.nin,
      'bvn':''
    };

    return piras_profile;
  }

  submitNin() {
    if (this.stage == 1) {
      if (
        !this.signupwtForm.value.nin ||
        String(this.signupwtForm.value.nin).length < 6
      ) {
        this.toastService.error("Please enter your NIN number", "Invalid NIN",  {
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
        return;
      }

      this.loadingText = "Verifying NIN...";
      this.loading = true;
      let data = {"nin":this.signupwtForm.value.nin};

      console.log("data is ", data);

      let nin = this.signupwtForm.value.nin;
      
      this.httpService.doGet("users/validate_nin/"+nin).subscribe(
          (res: any) => {
            this.loading = false;
            this.loadingText = "Submit";
            console.log('response ' , res);
            if (res && res.id && res.id.length > 5) {
              this.profile = res;
              this.profile.name = res.name || `${res.firstname} ${res.surname}`;
              this.toastService.success(
                this.profile.firstname + ' ' + this.profile.surname,
                "Profile found!",
                {
                  timeOut: 3000,
                  closeButton: true,
                  progressBar: true,
                }
              );
              this.user_data = this.convertNINProfileToPirasProfile(res);
              this.stage++;
            } else {
              this.toastService.error("NIN was not found!", 'Please check input and try again', {
                timeOut: 3000,
                closeButton: true,
                progressBar: true,
              });
            }
          },
          (err) => {
            console.log('err', err);
            let error = 'Error!';
            let errorMessage = 'Request failed. Contact Support.';
            this.loading = false;
            this.loadingText = "Submit";

            if(parseInt(err.status) == 404) {
              error = 'Not Found!';
              errorMessage = 'Existing TIN not found.'
            }

            if(parseInt(err.status) == 403) {
              error = 'Not Allowed';
              errorMessage = 'Existing TIN is Company TIN'
            }

            if(parseInt(err.status) == 400) {
              error = 'Error!';
              errorMessage =  err.error.message[0];
            }

            this.toastService.error(
              errorMessage,
              error,
              {
                timeOut: 15000,
                closeButton: true,
                progressBar: true,
              }
            );
          }
        );
    } else {
      
      if (
        this.signupwtpassForm.value.password.trim() !==
        this.signupwtpassForm.value.confirm_password.trim()

      ) {
        this.toastService.error(
          "Password and confirm password do not match!",
          "Error!",
          { timeOut: 3000, closeButton: true, progressBar: true }
        );
      }  else if (this.signupwtpassForm.value.password.length < 6) {
        this.toastService.error(
          "Your password must be longer than 5 characters",
          "Error!",
          {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          }
        );
      } else {
        this.loading = true;
        this.loadingText = "Setting up user profile...";
        this.user_data.password = this.signupwtpassForm.value.password;
        this.user_data.confirm_password = this.signupwtpassForm.value.confirm_password;
        this.user_data.raw_password= this.user_data.password;
        
        console.log('sending ', this.user_data);
        this.httpService
          .doPost(
            "users/register_with_nin/",
            this.user_data
          )
          .subscribe(
            (res: any) => {
              if (res.status == "success") {
                this.loading = false;
                this.loadingText = "Submit";

                this.toastService.success(
                  "TIN profile successfully registered. Redirecting to login...",
                  "Congratulations!",
                  {
                    timeOut: 10000,
                    closeButton: true,
                    progressBar: true,
                  }
                );

                setTimeout(() => {
                  this.router.navigateByUrl("auth/signin");
                }, 8000)
                
              }
            },

            (err) => {
              this.loading = false;
              this.loadingText = "Submit";
              
              let error = 'Error!';
              let errorMessage = 'Unexpected error occured. Please contact support.'

              if(parseInt(err.status) === 400) {
                error = 'Request Error!';
                errorMessage = 'TIN is already profiled. Please login or reset password.';
              }

              if(parseInt(err.status) == 403) {
                error = 'Not Allowed';
                errorMessage = 'Existing TIN is Company TIN'
              }

              if(parseInt(err.status) === 404) {
                error = 'Not Found!';
                errorMessage = 'TIN profile not found. Please Signup.'
              }

              this.toastService.error(
                errorMessage,
                error,
                {
                  timeOut: 10000,
                  closeButton: true,
                  progressBar: true,
                }
              );
            }
          );
      }
    }
  }
}
