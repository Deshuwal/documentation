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
  templateUrl: "./signupwt.component.html",
  styleUrls: ["./signupwt.component.scss"],
  animations: [SharedAnimations],
})
export class SignupwtComponent implements OnInit {
  signupwtForm: FormGroup;
  signupwtpassForm: FormGroup;
  loading: boolean;
  loadingText: string = "";

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
      tnumber: [""],
    });

    this.signupwtpassForm = this.fb.group({
      password: [""],
      confirm_password: [""],
    });
  }

  submitTin() {
    if (this.stage == 1) {
      if (
        !this.signupwtForm.value.tnumber ||
        String(this.signupwtForm.value.tnumber).length < 6
      ) {
        this.toastService.error("Please enter your tin number", "Invalid TIN",  {
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
        return;
      }

      this.loadingText = "Verifying Tin...";
      this.loading = true;

      this.httpService
        .doGet("users/get_tin_profile/" + this.signupwtForm.value.tnumber)
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.loadingText = "Submit";
            if (res.status == "success") {
              //@todo phone, verification code, and tin should all go under profile. Just trying not to avoid refactoring now
              this.profile = res.data;
              this.profile.name = res.data.name || `${res.data.first_name} ${res.data.surname}`;
              this.toastService.success(
                this.profile.name,
                "Profile found!",
                {
                  timeOut: 3000,
                  closeButton: true,
                  progressBar: true,
                }
              );
              this.stage++;
            } else {
              this.toastService.error("Not found!", res.message, {
                timeOut: 3000,
                closeButton: true,
                progressBar: true,
              });
            }
          },
          (err) => {
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
              error = 'Bad Request!';
              errorMessage = 'Account is already profiled. Please reset password and continue.'
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
        this.httpService
          .doPost(
            "users/register_tin_profile/" + this.signupwtForm.value.tnumber,
            this.signupwtpassForm.value
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
