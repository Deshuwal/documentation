import { Component, OnInit } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
  filter,
} from "rxjs/operators";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { concat, Observable, of, Subject } from "rxjs";
import { ConfirmedValidator } from './confirmed.validator';


@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./change-user-password.component.html",
  styleUrls: ["./change-user-password.component.scss"],
  animations: [SharedAnimations],
})
export class ChangeUserPassword implements OnInit {
  
  changePasswordFormGroup: FormGroup;
  loading: boolean = false;

  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
  ) {}

  config = {
    displayKey: "company_name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 50,
    moreText: "More",
    searchPlaceholder: "Search by TIN.",
    noResultsFound: "No results found!",
    searchOnKey: "tin",
  };

  userProfile: any;

  currentTin: any;

  ngOnInit() {
    // this.loadMdas();
    this.loadTins();
    this.userProfile = this.localStore.getItem("user");

    this.changePasswordFormGroup = this.fb.group({
      tin_slug: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirm_password: ["", [Validators.required]],
    }, 
    { 
      validator: ConfirmedValidator('password', 'confirm_password')
    });

  }

  foundTIN$: Observable<any>;
  companiesLoading = false;
  companiesInput$ = new Subject<string>();
  minLengthTerm = 3;
  foundTins = [];

  fieldTextType: boolean;

	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}

  loadTins() {
    this.foundTIN$ = concat(
      of([]), // default items
      this.companiesInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => (this.companiesLoading = true)),
        switchMap((term) => {
          return this.getCompanies(term).pipe(
            map(({ data }) => {
              const response = data.map((data: any) => {
                if (data.first_name && data.surname) {
                  return {
                    ...data,
                    payer_name: `${data.first_name}  ${data.surname}`,
                    name: `${data.first_name}  ${data.surname} (${data.tin})`,
                  };
                } else {
                  return {
                    ...data,
                    payer_name: data.name,
                    name: `${data.name} (${data.tin})`,
                  };
                }
              });

              this.foundTins = response;
              return response;
            }),
            catchError(() => of([])), // empty list on error
            tap(() => (this.companiesLoading = false))
          );
        })
      )
    );
  }

  getCompanies(term: string = null): Observable<any> {
    return this.dl.doGet("/users/search_tins?tin=" + term);
  }

  get f(){
    return this.changePasswordFormGroup.controls;
  }

  matchedTIN: any;
  
  onDropdownClick(item) {
    if (this.changePasswordFormGroup.value.tin_slug) {
      const matches = this.changePasswordFormGroup.value.tin_slug.match(/\((.*?)\)/);
      const matched = this.foundTins.find((el) => el.tin == matches[1]);
      // console.log({ matched });
      this.matchedTIN = matched;
    }
  }

  changeUserPassword() {
    this.loading = true;

    console.log('user', this.matchedTIN.tin);
    console.log('password',  this.changePasswordFormGroup.value.password);
    console.log('Confirm password',  this.changePasswordFormGroup.value.confirm_password);


    if (this.changePasswordFormGroup.valid) {
			this.loading = true;

			let url = "/users/change_user_password";
      let data = this.changePasswordFormGroup.value;
      data.tin = this.matchedTIN.tin

      console.log({data});
      

			this.dl
				.doPost(url, { ...data })
				.subscribe(
					(res: any) => {
						this.loading = false;
            console.log('response', res);
						if (res && res.status && res.status == "success") {
							this.toastr.success("Success", res.message, {
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							});
							this.changePasswordFormGroup.reset();
						} else {
							this.loading = false;
							this.toastr.error("Failed!", "Network error. Try again", {
								timeOut: 10000,
								closeButton: true,
								progressBar: true,
							});
						}
					},
					(err) => {
						console.log(err);
						// if (err.error.errors) {
						// 	Object.entries(err.error.errors).forEach((err) => {
						// 		console.log({ err });
						// 		this.toastr.error(
						// 			err[0],
						// 			`${err[0]} is already associated with an account`,
						// 			{
						// 				timeOut: 10000,
						// 				closeButton: true,
						// 				progressBar: true,
						// 			}
						// 		);
						// 	});
						// }
						this.loading = false;
					}
				);
		} else {
			this.toastr.error("Failed!", "Please fill all compulsory fields", {
				timeOut: 10000,
				closeButton: true,
				progressBar: true,
			});
		}
    
  }
  
  closeModal() {
    this.modalService.dismissAll("dismissed");
    window.location.reload();
  }

}
