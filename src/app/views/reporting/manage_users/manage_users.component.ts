import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Utils } from "src/app/shared/utils";
import { ActivatedRoute } from "@angular/router";
import { ManageUserService } from "./manage-user.service";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";
import { HttpClient } from "@angular/common/http";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { OldPlatformNegotiatorService } from "src/app/shared/services/old_platform_negotiator";
import { Page } from "src/app/shared/models/Page";
import {Exporter } from 'src/app/shared/models/exporter';
interface ITagUser {
  id?: number;
  name?: string;
}

export class Person {
  id: number;
  firstName: string;
  lastName: string;
}



@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./manage_users.component.html",
  styleUrls: ["./manage_users.component.scss"],
  providers: [ManageUserService],
  animations: [SharedAnimations],
})
export class Manage_usersComponent implements OnInit {
  @ViewChild("modalConfirm", { static: false }) private modalContent;
  @ViewChild("addTagModal", { static: false }) private addTagModal;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  mdas: any;
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  SearchLoading = false;
  editTitle: string = "";
  assessments = [];
  taxItems: any;

  exporter:Exporter = new Exporter();

  cache: any = {};
  userRole = [
    "Tax Payer (EndUsers)",
    "Super Admin",
    "Vendor",
    "Mda Admin",
    "Demand Notice Officer",
    "Reporting Oficer",
    "Accounts Officer",
  ];

  userProfile: any;
  pagination: Page = new Page();

  filteredItems: any[] = [];
  filteredUser: any[] = [];
  next_page: number;
  page_count: number;
  per_page_count: number;
  previous_page: number;
  result_count: number;
  pageNumber: number;
  total_count: number;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  totalUsers: any;

  from: string;
  to: string;

  modal: NgbModal;
  public tagUser: ITagUser = { id: null, name: null };
  public userTags: string = "";
  public addingTags: boolean = false;

  status: any;
  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private manageUserService: ManageUserService,
    private breadcrumb: BreadcrumbService,
    private printpdfService: PrintpdfService,
    private http: HttpClient,
    public negotiator: OldPlatformNegotiatorService
  ) {}



  setPage(info:any){

    console.log("clicked set page", info);
    this.pagination.setCurrentPage(info.offset); 

    console.log("pagination now at " + this.pagination.currentPage);

    this.filterRecord();

  }


  exportToExcel() {

    let headers:string[] = [];
    headers.push("id");
    headers.push("name");
    headers.push("phone");
    headers.push("tin");
    headers.push('create_date'); 
    
    let csv =  this.exporter.getCsVUsersList(this.assessments, headers);


    console.log("exporting", csv); 
  }

  keyup(e) {
    const text: string = e.target.value;
    if (!text.trim()) return this.loadUsers({ offset: 0 });

    if (text.length < 3) return;
    this.dl.doGet(`/users/search/${text}`).subscribe(
      (res: any) => {
        this.assessments = res.data.map((user, idx) => ({
          ...user,
          sn: idx + 1,
        }));
        this.manageUserService.manageUserService.next(this.assessments);
        console.log({ search: this.assessments });
        this.table.offset = 0;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  persons;

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });
    this.route.params.subscribe((params) => {
      this.status = params["status"];
    });
    this.breadcrumb.setCrumbItem("manageUserRoles");
    this.loadUsers({ offset: 0 });
    //this.getTotalUsers();
  }

  timeAgo(timestamp: number) {
    return Utils.getTimeIntervalPhpTimeStamp(timestamp);
  }

  capitalise(words) {
    return words
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

   

  toggleAdmin(userId, role) {
    let url = `users/toggle_role/${userId}/${role}`;

    this.dl.doGet(url).subscribe(
      (res: any) => {
        // console.log(res.message);
        this.toastr.success(res.message, "Success!", { timeOut: 3000 });
        this.assessments = this.assessments.map((user) => {
          if (user.id == userId) {
            return { ...user, ...res.data };
          }
          return user;
        });
      },
      (err) => {
        this.toastr.error("Please try again", "Error!", { timeOut: 3000 });
      }
    );
  }

  createVendor(userId, role) {
    let url = `vendor/create/${userId}`;

    this.dl.doPost(url, {}).subscribe(
      (res: any) => {
        // console.log(res.message);
        this.toastr.success(res.message, "Success!", { timeOut: 3000 });
        this.assessments = this.assessments.map((user) => {
          if (user.id == userId) {
            return { ...user, ...res.data };
          }
          return user;
        });
      },
      (err) => {
        this.toastr.error("Please try again", "Error!", { timeOut: 3000 });
      }
    );
  }

  downloadUserTable(div, name) {
    this.printpdfService.exportAsPDF(div, name);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

  

  getTotalUsers() {
    this.loading = true;
    let url = "users/get_user_count";
    this.dl.doGet(url).subscribe(
      (res: any) => {
        this.totalUsers = res.data;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  loadUsers(pageInfo) {
    this.loading = true;
    this.pageNumber = pageInfo.offset;

    let url = "users/list_users/" ;

    this.dl.doPost(url, {}).subscribe(
      (res: any) => {
        console.log("users ", res);
        if (res.length < 1) {
          this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
        }
        this.assessments = res.list;
        this.loading = false;
        this.pagination.setTotalItemCount(res.items_count);
        this.totalUsers = res.items_count;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  openAddTagModal(user: any) {
    this.tagUser = {
      id: user.id,
      name: `${user.first_name} ${user.surname}`,
    };

    this.modalService
      .open(this.addTagModal, { ariaLabelledBy: "Add Tags", centered: true })
      .result.then((modal) => (this.modal = modal));
  }

  submitUserTags() {
    if (!this.tagUser.id) {
      this.toastr.error("Select valid user account.", "Invalid Selection.");
      return;
    }

    if (this.userTags.length < 1) {
      this.toastr.error("Tags cannot be empty", "Invalid Input");
      return;
    }
    this.addingTags = true;

    this.dl
      .doPost(`insight/user/${this.tagUser.id}`, { tags: this.userTags })
      .subscribe(
        (res) => {
          this.toastr.success("Tags added", "Request Completed.");
        },
        (err) => {
          this.toastr.error(err.message, "Request Error");
        },
        () => {
          this.addingTags = false;
          this.modalService.dismissAll("dismiss");
        }
      );
  }

  config = {
    displayKey: "title", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3,
    placeholder: "Filter by MDA",
    noResultsFound: "No results found!",
  };

  showPhoneInput: boolean = true;
  showTinInput: boolean = false;
  selectedOption: string;

  searching: boolean = false;

  documentName: string;

  tinOrPhoneNumberField: number;
  tinOrPhoneNumber(e) {
    // console.log({ e });
    this.tinOrPhoneNumberField = e.target.value;
  }

  onChange(selected) {
    console.log(selected);
    if (selected == "tin") {
      this.showTinInput = true;
      this.showPhoneInput = false;
    } else {
      this.showTinInput = false;
      this.showPhoneInput = true;
    }
    this.selectedOption = selected;
  }

  filterRecord() {
    this.loading = true;
    this.searching = true; 
    let params:any = {};
    params.search = this.tinOrPhoneNumberField;
    params.from = this.from;
    params.to = this.to;
    params.page = this.pagination.currentPage;

    console.log("params ", params);


    this.dl
      // .doGet("users/get_user_by_tin/" + companyTin)
      .doPost(
        "users/list_users", params
      )
      .subscribe(
        (res: any) => {
          console.log('result listing users', res);
           
          this.loading = false;
          this.searching = false;
          this.assessments = res.list; 
          this.pagination.setTotalItemCount(res.items_count);
          console.log(this.pagination);
          
 
        },
        (err) => {
          this.loading = false;
          this.searching = false;
          this.toastr.error(
            "An error occured... Please verify that the filter params are correct"
          );
        }
      );
 
  }

  closeModal() {
    this.modalService.dismissAll("dismssis");
    window.location.reload();
  }

  exportAsPDF(div) {
    this.printpdfService.exportAsPDF(
      div,
      this.documentName + "-tax-enumeration.pdf"
    );
  }

  printPDFS(div) {
    this.printpdfService.printNoticeAssMent(div);
  }
}
