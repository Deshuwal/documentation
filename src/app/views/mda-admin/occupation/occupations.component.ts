import { Component, OnInit, ViewChild } from "@angular/core";
import { echartStyles } from "src/app/shared/echart-styles";
import { ProductService } from "src/app/shared/services/product.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { AssessmentService } from "src/app/shared/services/assessment.service";
import { Utils } from "src/app/shared/utils";

import { ActivatedRoute } from "@angular/router";

import {
	Router,
	RouteConfigLoadStart,
	ResolveStart,
	RouteConfigLoadEnd,
	ResolveEnd,
} from "@angular/router";
import { BreadcrumbService } from "src/app/shared/services/breadcrumb.service";
import { DropdownDataService } from "src/app/shared/services/dropdown-data.service";

@Component({
	selector: "app-dashboard-v2",
	templateUrl: "./occupations.component.html",
	styleUrls: ["./occupations.component.scss"],
	animations: [SharedAnimations],
})
export class OccupationComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	assessments: any;
	taxItems: any;

	occupations: any[] = [];

	@ViewChild("modalConfirm", { static: false }) private modalContent;

	@ViewChild("modalCreate", { static: false }) private addModal;

	userProfile: any;
	status: any;
	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private localStore: LocalStoreService,
		private route: ActivatedRoute,
		private assessmentService: AssessmentService,
		private breadcrumb: BreadcrumbService,
		private dropdownDataService: DropdownDataService
	) {}

	ngOnInit() {
		this.fetchStatuses();
		this.userProfile = this.localStore.getItem("user");
		this.breadcrumb.setCrumbItem("setupOccupation");
		this.taxItemForm = this.fb.group({
			name: ["", Validators.required],
		});
	}

	fetchStatuses() {
		this.dropdownDataService.fetchOccupations().subscribe(
			(occupation: { name: string; id: string }[]) =>
				(this.occupations = occupation),
			(err) => (this.occupations = [])
		);
	}

	add() {
		this.modalService.open(this.addModal, {
			ariaLabelledBy: "modal-basic-title",
			centered: true,
		});
	}
	closeModal() {
		this.modalService.dismissAll("dismssis");
		window.location.reload();
	}
	save() {
		this.loading = true;

		this.dl.doPost("data/occupations_save", this.taxItemForm.value).subscribe(
			(res) => {
				this.toastr.success("Title added!", "Success!", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.closeModal();
				this.loading = false;
				this.fetchStatuses();
			},
			(err) => {
				this.toastr.success("Failed to Save!", "Error!", {
					timeOut: 10000,
					closeButton: true,
					progressBar: true,
				});
				this.loading = false;
			}
		);
	}

	editTaxItem(taxItem: any = null) {
		if (taxItem) {
			this.editTitle = "Edit TaxItem";
			this.taxItemForm.setValue({
				id: taxItem.id,
				rules: taxItem.rules,
				title: taxItem.title,
				mda_id: taxItem.mda_id,
			});
		} else {
			this.editTitle = "Create TaxItem";
			this.taxItemForm.setValue({ title: "", mda_id: "", id: "", rules: "" });
		}

		this.editMode = true;
	}

	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}

	formatNumber(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}
