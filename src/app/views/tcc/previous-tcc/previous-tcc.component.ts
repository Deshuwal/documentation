import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { HttpService } from "src/app/shared/services/http.service";
import { LocalStoreService } from "src/app/shared/services/local-store.service";

@Component({
	selector: "app-previous-tcc",
	templateUrl: "./previous-tcc.component.html",
	styleUrls: ["./previous-tcc.component.scss"],
	animations: [SharedAnimations],
})
export class PreviousTccComponent implements OnInit {
	constructor(
		private dl: HttpService,
		private localStore: LocalStoreService,
		private toastService: ToastrService
	) { }
	tccList = [];
	tccListR = [];
	total_count: number = 50;
	userProfile: any;
	loading = false;
	selectedMDA: any = null;
	isSearching: boolean = false;
	isReset: boolean = false;

	ngOnInit() {
		this.fetchTccList();
	}

	approveTCC(id) {
		this.dl.doGet("tcc/approve_tcc/" + id).subscribe(
			(res: any) => {
				this.fetchTccList();
				this.toastService.success("TCC application successfully approved!");
			},
			(err) => {
				this.localStore.setItem("err", err);
			}
		);
	}

	fetchTccList() {
		this.loading = true;
		this.userProfile = this.localStore.getItem("user");
		this.dl.doGet("/tcc/list/1").subscribe(
			(res: any) => {
				this.loading = false;
				this.tccListR = res.data.result;
				this.tccList = res.data.result;
			},
			(err) => {
				this.loading = false;
			}
		);
	}


	filterBySector() {
		this.isReset = true;
		this.isSearching = true;
		this.tccList = this.tccListR.filter(x => x.sector == this.selectedMDA);
		this.isSearching = false;
	}

	reloadCurrentPage(){
		this.isReset = false;
		this.tccList = this.tccListR;
	}

	onPageChange() { }
}
