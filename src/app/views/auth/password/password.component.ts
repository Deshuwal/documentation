import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { RoleHome } from 'src/app/shared/models/role-home';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  animations: [SharedAnimations],
})
export class PasswordComponent implements OnInit {
  public ref: string;
  public passwordForm: FormGroup;

  public submitted = false;
  public loading: boolean = false;
  public loadingText: string = 'Processing...';

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.ref = params.get('ref');
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_new_password: ['', Validators.required],
    });
  }

    get fval() {
    return this.passwordForm.controls;
  }
  /**
   * @param  {} {this.submitted=true;if(this.passwordForm.valid
   * @param  {any=this.passwordForm.value;this.httpService.doPost(`auth/complete_reset_password/${this.ref}`} {this.loading=true;constdata
   * @param  {} data
   * @param  {any} .subscribe((res
   */
  submitRequest() {
    this.submitted = true;

    if (this.passwordForm.valid) {
      this.loading = true;
      const data: any = this.passwordForm.value;
      this.httpService
        .doPost(`auth/complete_reset_password/${this.ref}`, data)
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.submitted = false;
            this.passwordForm.patchValue({ password: '', new_password: '', confirm_new_password: '' });
            this.toastService.success(res.message, 'Successful');
            
            setTimeout(() => {
              this.router.navigateByUrl(RoleHome.default);
            }, 5000);
            
          },
          (error: any) => {
            this.loading = false;
            let message =
              error.status == 0
                ? 'Connection failed. Please retry!'
                : error.error.message;
            if (error.status == 200) {
              message = 'Unexpected error occured. Please retry!';
            }
            this.toastService.error(message, 'Error!');
          }
        );
    }
  }
}
