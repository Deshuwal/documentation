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

interface ISelectedAgent {
  id?: number;
  name?: string;
  new_fund?:number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
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
  animations: [SharedAnimations],
})
export class Manage_usersComponent implements OnInit {
  @ViewChild("modalConfirm", { static: false }) private modalContent;
  @ViewChild("addFundsModal", { static: false }) private addFundsModal;

  @ViewChild("activateAgentModal", { static: false }) private activateAgentModal;

  @ViewChild("deActivateAgentModal", { static: false }) private deActivateAgentModal;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  mdas: any; 
  taxItemForm: FormGroup;
  editMode: boolean;
  loading: boolean = false;
  SearchLoading = false;
  editTitle: string = "";
  assessments = [];
  taxItems: any;
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
  page: number = 1;

  filteredItems: any[] = [];
  next_page: number;
  page_count: number;
  per_page_count: number;
  previous_page: number;
  result_count: number;
  pageNumber: number;
  total_count: number;

  modal: NgbModal;
  public selectedAgent: ISelectedAgent = { id: null, name: null , new_fund:null};
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
    private http: HttpClient
  ) {}

  keyup(e) {
    console.log({ target: e.target.value });
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
    this.breadcrumb.setCrumbItem("manageAgents");
    this.loadUsers({ offset: 0 });
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

  onPageChange(pageInfo) {
    this.pageNumber = pageInfo.offset;

    // Calculate row offset in the UI using pageInfo
    // This is the scroll position in rows
    const rowOffset = pageInfo.offset * pageInfo.pageSize;

    // When calling the server, we keep page size fixed
    // This should be the max UI pagesize or larger
    // This is not necessary but helps simplify caching since the UI page size can change
    const page = { size: 10, pageNumber: pageInfo.offset + 1 };
    page.size = 10;
    // page.pageNumber = pageInfo.offset + 1;
    this.pageNumber = pageInfo.offset + 1;

    console.log("page number", pageInfo, this.cache);
    // We keep a index of server loaded pages so we don't load same data twice
    // This is based on the server page not the UI
    if (this.cache[page.pageNumber]) return;
    this.cache[page.pageNumber] = true;

    let url = "walletAdmin/list_agents";
    this.loading = true;

    this.dl.doGet(url).subscribe(
      (res: any) => {
        if (res.length < 1) {
          this.toastr.info("No payments found ", "Empty!", { timeOut: 3000 });
        }

        this.assessments = res.agents;
        console.log('assessments is ', this.assessments);
       // this.next_page = res.data.next_page;
         this.page_count = res.agents.length;
       // this.per_page_count = res.data.per_page_count;
       // this.previous_page = res.data.next_page - 1;
       // this.result_count = res.data.per_page_count;
       // this.total_count = res.data.total_count;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  toggleAdmin(userId, role) {
    let url = `users/toggle_role/${userId}/${role}`;

    this.dl.doGet(url).subscribe(
      (res: any) => {
        console.log(res.message);
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
        console.log(res.message);
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


  DateFromString(s){ 
    
    if(!s) return "Never";

    let date = new Date(s * 1000);
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
 
   }

  numberWithCommas(x) {
    if(!x) return "0";
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

  downloadUserTable(div, name) {
    this.printpdfService.exportAsPDF(div, name);
  }

  loadUsers(pageInfo) {
    this.loading = true;
    this.pageNumber = pageInfo.offset;

    let url = "walletAdmin/list_agents";

    this.dl.doGet(url).subscribe(
      (res: any) => {
        
        console.log("result ", res);
        if (res.length < 1) {
          this.toastr.info("No agents found ", "Empty!", { timeOut: 3000 });
        }
 
        this.assessments = res.agents.map((user, idx) => ({
          ...user,
          sn: idx + 1,
        }));
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  openFundWalletModal(user: any) {
    this.selectedAgent = {
      id: user.id,
      new_fund: 0,
    
      name: user.first_name? `AGENT-${user.id} (${user.first_name} ${user.surname})` : `AGENT-${user.id} (${user.name})`
    };

    this.modalService
      .open(this.addFundsModal, { ariaLabelledBy: "Add Funds", centered: true })
      .result.then((modal) => (this.modal = modal));
  }


  openActivateAgentModal() {
    this.selectedAgent = {
      id: null,
      new_fund: 0,
      name: null,
    };

    this.modalService
      .open(this.activateAgentModal, { ariaLabelledBy: "Activate Agent", centered: true })
      .result.then((modal) => (this.modal = modal));
  }


  openDeactivateAgentModal(user: any) {
    this.selectedAgent = {
      id: user.id,
      new_fund: 0,
      name: user.first_name? `AGENT-${user.id} (${user.first_name} ${user.surname})` : `AGENT-${user.id} (${user.name})`,

    };

    this.modalService
      .open(this.deActivateAgentModal, { ariaLabelledBy: "deActivate Agent", centered: true })
      .result.then((modal) => (this.modal = modal));
  }

  addingFunds:boolean = false;
  submitFundWallet() {
    console.log(this.selectedAgent);
    if (!this.selectedAgent.id) {
      this.toastr.error("Select valid user account.", "Invalid Selection.");
      return;
    }

    if (this.selectedAgent.new_fund < 10000) {
      this.toastr.error("Funds must be upto 10,000 NGN", "Invalid Input");
      return;
    }
    if (this.selectedAgent.new_fund > 500000) {
      this.toastr.error("Funds must not be more than  500,000 NGN", "Invalid Input");
      return;
    }
    this.addingFunds = true; 
    this.dl
      .doPost('walletAdmin/credit_agent', { amount: this.selectedAgent.new_fund, agent_id:this.selectedAgent.id })
      .subscribe(
        (res:any) => {

          if(res.status == "success"){
           this.toastr.success("Funded Wallet!", "Request Completed!");
           this.ngOnInit();

          }
          else{

           this.toastr.error("Error Funding Wallet!", res.message);

          }
        },
        (err) => {
          this.toastr.error(err.message, "Request Error");
        },
        () => {
          this.addingFunds = false;
          this.modalService.dismissAll("dismiss");
        }
      );
  }


  activatingAgent:boolean = false;
  submitActivateAgent() {
    console.log(this.selectedAgent);
    if (!this.selectedAgent.name || this.selectedAgent.name.indexOf("-")==-1) {
      this.toastr.error("Enter a valid agent Id.", "Invalid Agent Id.");
      return;
    }


    this.selectedAgent.id = Number(this.selectedAgent.name.split("-")[1]);

    if (this.selectedAgent.id < 1) {
      this.toastr.error("Enter a valid agent id", "Invalid Agent Id");
      return;
    }

    this.activatingAgent = true;

    
    this.dl
      .doGet('walletAdmin/make_agent/'+this.selectedAgent.id)
      .subscribe(
        (res:any) => {

          if(res.status == "success"){
           this.toastr.success("Activated Agent!", "Request Completed!");
           this.ngOnInit();

          }
          else{

           this.toastr.error("Error Activating Agent!", res.message);

          }
        },
        (err) => {
          this.toastr.error(err.message, "Request Error");
        },
        () => {
          this.activatingAgent = false;
          this.modalService.dismissAll("dismiss");
        }
      );
  }



  deActivatingAgent:boolean = false;

  submitDeactivateAgent() {
    console.log(this.selectedAgent); 

    if (this.selectedAgent.id < 1) {
      this.toastr.error("Invalid agent id", "Invalid Agent Id");
      return;
    }

    this.deActivatingAgent = true;

    
    this.dl
      .doGet('walletAdmin/unmake_agent/'+this.selectedAgent.id)
      .subscribe(
        (res:any) => {

          if(res.status == "success"){
           this.toastr.success( "Request Completed!", "Deactivated Agent!");
           this.ngOnInit();

          }
          else{

           this.toastr.error(res.message, "Error Deactivating Agent!");

          }
        },
        (err) => {
          this.toastr.error(err.message, "Request Error");
        },
        () => {
          this.deActivatingAgent = false;
          this.modalService.dismissAll("dismiss");
        }
      );
  }
}
