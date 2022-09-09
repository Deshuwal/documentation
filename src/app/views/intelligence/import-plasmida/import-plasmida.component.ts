import * as XLSX from 'xlsx';
import { Component, OnInit } from '@angular/core';
import { TinService } from 'src/app/shared/services/tinservice';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

interface IUser {
  first_name: string;
  surname: string;
  other_names?: string;
  home_town: string;
  nationality: string;
  gender: string;
  marital_status: string;
  soo: string;
  payer_address: string;
  lga: string;
  emp_status: string;
  age: number;
  dob: string;
  occupation: string;
  phone: string;
  email?: string;
  title: string;
  nin?: string;
  pre_tin?: string;
  bvn?: string;
  source?: string;
}

export interface IExcelUser {
  TITLE_REQUIRED: string;
  FIRST_NAME_REQUIRED: string;
  SURNAME_REQUIRED: string;
  OTHER_NAMES_OPTIONAL?: string;
  HOME_TOWN_REQUIRED: string;
  NATIONALITY_REQUIRED: string;
  GENDER_REQUIRED: string;
  MARITAL_STATUS_REQUIRED: string;
  STATE_OF_ORIGIN_REQUIRED: string;
  PAYER_ADDRESS_REQUIRED: string;
  LGA_REQUIRED: string;
  EMPLOYMENT_STATUS_REQUIRED: string;
  AGE_REQUIRED: number;
  DATE_OF_BIRTH_REQUIRED: string;
  OCCUPATION_REQUIRED: string;
  PHONE_REQUIRED: string;
  EMAIL_OPTIONAL?: string;
  NIN_OPTIONAL?: string;
  BVN_OPTIONAL?: string;
}

@Component({
  selector: 'app-import-plasmida',
  templateUrl: './import-plasmida.component.html',
  styleUrls: ['./import-plasmida.component.scss'],
  animations: [SharedAnimations],
})
export class ImportPlasmidaComponent implements OnInit {
  private registered = 0;
  private failed = 0;
  public loading = false;
  public registering = false;
  public errMessage = {};
  public isValidFile = false;
  private fileData: any = {};
  private addUserUrl: string;
  public profile: any;
  public file: any;

  constructor(
    private http: HttpService,
    private tinService: TinService,
    private localStore: LocalStoreService,
    private toastService: ToastrService,
    private breadcrumb: BreadcrumbService,
  ) {
    this.addUserUrl = '/users/admin_post_user';
  }

  ngOnInit() {
    this.profile = this.localStore.getItem("user");
    this.breadcrumb.setCrumbItem("intelligenceImportPlasmida");  
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  submit() {
    if (!this.file) {
      this.toastService.error('No file selected.');
      return;
    }

    if (!this.file.name.match(/(.xls|.xlsx)/)) {
      this.toastService.error('Invalid file format selected.');
      return;
    }

    this.loading = true;

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file);
    reader.onload = (e: any) => {
      const byteString: string = e.target.result;
      const xlsWb: XLSX.WorkBook = XLSX.read(byteString, { type: 'binary' });
      const wsname: string = xlsWb.SheetNames[0];
      const currentWS: XLSX.WorkSheet = xlsWb.Sheets[wsname];
      this.fileData = XLSX.utils.sheet_to_json(currentWS);
    };

    reader.onloadend = () => {
      this.loading = false;
      this.registerUsers();
    };
  }

  private registerUsers() {
    this.toastService.info(`${this.fileData.length} record(s) found.`);

    if (this.fileData.length) {
      let done = 0;
      this.failed = 0;
      this.registered = 0;
      this.registering = true;
      this.fileData.forEach((record: any) => {
        const user = this.prepareUsers(record);
        this.http.doPost(this.addUserUrl, user).subscribe(
          (res) => {
            // console.log(res);
            done += 1;
            this.registered += 1;
            if (done == this.fileData.length) {
              this.handleDone();
            }
          },
          (err) => {
            // console.log(err);
            done += 1;
            this.failed += 1;
            if (done == this.fileData.length) {
              this.handleDone();
            }
          }
        );
      });
    }
  }

  private prepareUsers(data: IExcelUser): any {
    // console.log(data);
    let user: IUser | any = {};
    user.title = data.TITLE_REQUIRED;
    user.first_name = data.FIRST_NAME_REQUIRED;
    user.surname = data.SURNAME_REQUIRED;
    if (data.OTHER_NAMES_OPTIONAL) user.other_names = data.OTHER_NAMES_OPTIONAL;
    user.home_town = data.HOME_TOWN_REQUIRED;
    user.nationality = data.NATIONALITY_REQUIRED;
    user.gender = data.GENDER_REQUIRED;
    user.marital_status = data.MARITAL_STATUS_REQUIRED;
    user.soo = data.STATE_OF_ORIGIN_REQUIRED;
    user.payer_address = data.PAYER_ADDRESS_REQUIRED;
    user.lga = data.LGA_REQUIRED;
    user.emp_status = data.EMPLOYMENT_STATUS_REQUIRED;
    user.age = data.AGE_REQUIRED;
    user.dob = data.DATE_OF_BIRTH_REQUIRED;
    user.occupation = data.OCCUPATION_REQUIRED;
    user.phone = data.PHONE_REQUIRED;
    if (data.EMAIL_OPTIONAL) user.email = data.EMAIL_OPTIONAL;
    if (data.NIN_OPTIONAL) user.nin = data.NIN_OPTIONAL;
    if (data.BVN_OPTIONAL) user.bvn = data.BVN_OPTIONAL;
    user.pre_tin = this.tinService.getPreTin(user.soo, user.lga);
    user.source = 'plasmida';
    return user;
  }

  private handleDone() {
    this.registering = false;
    this.toastService.info(
      `${this.registered} registered successfully. ${this.failed} failed.`
    );
  }
}
