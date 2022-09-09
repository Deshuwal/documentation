import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { Component, OnInit } from "@angular/core";
import { LocalStoreService } from "../../../shared/services/local-store.service";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/shared/services/http.service";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { PayeeCalculator } from "src/app/shared/models/payee_calculator";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { currentId } from "async_hooks";
@Component({
  selector: "app-dashboad-default",
  templateUrl: "./modify-assessment.component.html",
  styleUrls: ["./moidfy-assessment.component.css"],
  animations: [SharedAnimations],
})
export class ModifyAssessmentComponent implements OnInit {
  
  public modificationForm: FormGroup;
  public loading: boolean = false;  
  public userProfile:any;

  public done:boolean;
  public paymentStatuses:string[] = ["Paid", "Pending"];

  public brnUpdateResults:string = "";
 

  constructor(
    private localStore: LocalStoreService,
    private toastrService: ToastrService,
    private dl: HttpService,
    private fb: FormBuilder,
    private breadcrumb: BreadcrumbService,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("modifyAssessment");

    this.modificationForm = this.fb.group({
      brn: ["", Validators.required],
      full_name: ["", Validators.required],
      reason: ["", Validators.required], 
      newTin: [""],
      newName: [""],
      authorizedBy: ["", Validators.required],
      newPaymentStatus: [""]
    });
 
  }

  getFormValidationErrors() {
    Object.keys(this.modificationForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.modificationForm.get(key).errors;
      if (controlErrors != null) {

        let errorList:string = "";

        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          errorList+= key + " field is "+keyError +"\r\n";
         });
        
        this.toastrService.error(errorList, "Validation Error", { timeOut: 3000 });
    
      }
    });
  }
 


  postBrns:string[] = [];
  
  submit() {

    if(!this.modificationForm.valid){

      this.getFormValidationErrors();

    }

    let postData:any = {};

    for (const field in this.modificationForm.controls) { // 'field' is a string
      console.log(field, this.modificationForm.controls[field].value);
      postData[field] = this.modificationForm.controls[field].value;
    }

    if(postData.brn.indexOf(",") > -1){

      this.postBrns = postData.brn.split(",");
      console.log(this.postBrns);
      postData.brn = this.postBrns.pop().trim();
      console.log("new list", this.postBrns, postData);

    }
    this.loading = true;
    this.dl.doPost("/assessment/modify_assessment", postData).subscribe(
      (res: any) => {
        console.log("result modifying assessment ", res);
        this.loading = false;
        this.loading = false;
        if (res.status && res.status ==true){
          this.done=true;
          this.brnUpdateResults +=", "+ postData.brn+" SUCCESSS! ";

          if(this.postBrns.length > 0){
            this.handleBulk();
          }
          return this.toastrService.success(res.reason,"Request Successful", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });

        }
        else{
           return this.toastrService.info(res.reason,"Request Submitted", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });
         
        }
      },
      (err) => {

        this.brnUpdateResults +=", "+ postData.brn+" FAILURE! ";
         if(this.postBrns.length > 0){
            this.handleBulk();
         }
        console.log("save result error", err);
        this.loading = false;
        this.toastrService.error("Error", err.error, {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
        });
      }
    );
     
  }

   
  
     
  handleBulk() {
 

    let postData:any = {};

    for (const field in this.modificationForm.controls) { // 'field' is a string
      console.log(field, this.modificationForm.controls[field].value);
      postData[field] = this.modificationForm.controls[field].value;
    }
 
 
      console.log(this.postBrns);
      postData.brn = this.postBrns.pop().trim();
      console.log("new list", this.postBrns, postData); 

    this.loading = true;
    this.dl.doPost("/assessment/modify_assessment", postData).subscribe(
      (res: any) => {
        console.log("result modifying assessment ", res);
        this.loading = false;
        this.loading = false;
        if (res.status && res.status ==true){
          this.done=true;
          this.brnUpdateResults +=", "+ postData.brn+" SUCCESSS! ";

          if(this.postBrns.length > 0){
            this.handleBulk();
          }
          return this.toastrService.success(res.reason,"Request Successful", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });

        }
        else{
           return this.toastrService.info(res.reason,"Request Submitted", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          });
         
        }
      },
      (err) => {

        this.brnUpdateResults  +=", "+ postData.brn+" FAILURE! ";
        if(this.postBrns.length > 0){
          this.handleBulk();
        }
        console.log("save result error", err);
        this.loading = false;
        this.toastrService.error("Error", err.error, {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
        });
      }
    );
     
  }
}
