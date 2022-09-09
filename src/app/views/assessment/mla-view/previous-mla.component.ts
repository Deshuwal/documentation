import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import {
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { PrintpdfService } from "src/app/shared/services/printpdf.service";

@Component({
  selector: "app-dashboard-v2",
  templateUrl: "./previous-mla.component.html",
  styleUrls: ["./previous-mla.component.scss"],
  animations: [SharedAnimations],
})
export class ViewRegisteredVehicleComponent implements OnInit {
  
  loading: boolean = false;
  registeredVehicles: any;

  searchControl: FormControl = new FormControl();

  @ViewChild("modalConfirm", { static: false }) private modalContent;

  userProfile: any;
  searching: boolean = false;

  status: any;
  constructor(
    private dl: HttpService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private localStore: LocalStoreService,
    private route: ActivatedRoute,
    private printpdfService: PrintpdfService,
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.userProfile = this.localStore.getItem("user");

    this.breadcrumb.setCrumbItem("assessmentHistory");

    this.route.params.forEach((e: any) => {
      if (e.status) this.status = e.status;
    });

    this.route.params.subscribe((params) => {
      this.status = params["status"];
      this.loadRegisteredVehicles(); // reset and set based on new parameter this time
    });

    this.loadRegisteredVehicles();

    this.searchControl.valueChanges.subscribe((value: string) => {
      console.log("Value changed ", value);
      this.searching = true;
      setTimeout(() => {
        this.searching = false;
      }, 1000);
    });
  }

  loadRegisteredVehicles() {
    this.loading = true;
    this.dl.doGet(`vehicle/list/${this.userProfile.id}`).subscribe(
      (res:any) => {
        console.log("fetched registeredVehicles ", res.data[11]);
        this.registeredVehicles = res.data;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log("error fetching tax items", err);
      }
    );
  }

  print(div) {
    this.printpdfService.printNoticeAssMent(div);
  }

  download(div) {
    this.printpdfService.downloadAssessment(div);
  }

  vehicleDetailsForDisplay: any = {};

  viewVehicleDetails(assessment: any) {
    this.vehicleDetailsForDisplay = Object.assign({}, assessment);
    this.vehicleDetailsForDisplay.vehicle_owner_name = assessment.vehicle_owner;
    this.vehicleDetailsForDisplay.user_tin = assessment.user_tin;
    this.vehicleDetailsForDisplay.vehicle_name = assessment.vehicle_name;
    this.vehicleDetailsForDisplay.tin = assessment.user_tin || assessment.user_tin;
    this.vehicleDetailsForDisplay.vehicle_chasis = assessment.vehicle_chasis;
    this.vehicleDetailsForDisplay.vehicle_model = assessment.vehicle_model;
    this.vehicleDetailsForDisplay.vehicle_color = assessment.vehicle_color;
    this.vehicleDetailsForDisplay.vehicle_type = assessment.vehicle_type;
    this.vehicleDetailsForDisplay.engine_capacity = assessment.engine_capacity;
    this.vehicleDetailsForDisplay.seater_capacity = assessment.seater_capacity;
    this.vehicleDetailsForDisplay.load_capacity = assessment.load_capacity;
    this.vehicleDetailsForDisplay.gross_weight = assessment.gross_weight;
    this.vehicleDetailsForDisplay.license_type = assessment.license_type;
    this.vehicleDetailsForDisplay.plate_no = assessment.plate_no;
    this.vehicleDetailsForDisplay.amount = assessment.amount;
    this.modalService.open(this.modalContent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
    });
  }


  parsePhpDate(date: string) {
    return Utils.parsePhpDate(date);
  }

  parseDate(date) {
    return new Date(date * 10000);
  }

}
