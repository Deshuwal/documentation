import { Component, OnInit } from '@angular/core';
import { echartStyles } from 'src/app/shared/echart-styles';
import { ProductService } from 'src/app/shared/services/product.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/shared/utils';


import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
	selector: 'app-dashboard-v2',
	templateUrl: './mda.component.html',
	styleUrls: ['./mda.component.scss'],
	animations: [SharedAnimations]
})
export class MdaComponent implements OnInit {
	mdas: any;
	mdaForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";

	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private breadcrumb: BreadcrumbService
	) { }

	ngOnInit() {
		this.loadMdas();

		this.breadcrumb.setCrumbItem('setupMdas');




		this.mdaForm = this.fb.group({
			id: [''],
			title: ['', Validators.required],
			reg_number: [''],
			slug: ['']
		});

	}


	submitMda() {

		this.dl.doPost("/mdas/save", this.mdaForm.value).subscribe((res) => {
			console.log("result saving", res);
			this.editMode = false;
			this.loadMdas();
		}, error => {

			console.log("error saving mda ", error);
		})

	}

	loadMdas() {
		this.loading = true;
		this.dl.doGet("/mdas/list")
			.subscribe(res => {
				console.log("fetched mda ", res);
				this.mdas = res;
				this.loading = false;
			},
				(err => {
					this.loading = false;
					console.log("error fetching mda", err)
				}));
	}

	deleteInvoice(id, modal) {
		this.loading = true;
		this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
			.result.then((result) => {
				this.dl.doGet("/mdas/delete/" + id)
					.subscribe(res => {
						this.loading = false;
						this.toastr.success('Mda Deleted!', 'Success!', { timeOut: 3000 });
						this.loadMdas();
					})
			}, (reason) => {
				this.loading = false;
			});
	}


	editMda(mda: any = null) {

		if (mda) {
			this.editTitle = "Edit MDA";
			this.mdaForm.setValue({ title: mda.title, slug: mda.slug, reg_number: mda.reg_number, id: mda.id });
		}
		else {
			this.editTitle = "Create MDA";
			this.mdaForm.setValue({ title: '', reg_number: '', id: '', slug: '' });
		}

		this.editMode = true;

	}

	parsePhpDate(date: string) {

		return Utils.parsePhpDate(date);
	}
}
