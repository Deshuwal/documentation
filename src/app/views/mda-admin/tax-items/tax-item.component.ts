import { Component, OnInit } from '@angular/core';
import { echartStyles } from 'src/app/shared/echart-styles';
import { ProductService } from 'src/app/shared/services/product.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/shared/utils';

import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
	selector: 'app-dashboard-v2',
	templateUrl: './tax-item.component.html',
	styleUrls: ['./tax-item.component.scss'],
	animations: [SharedAnimations]
})
export class TaxItemComponent implements OnInit {
	mdas: any;
	taxItemForm: FormGroup;
	editMode: boolean;
	loading: boolean = false;
	editTitle: string = "";
	taxItems: any;

	filteredItems: any[] = [];

	searchControl: FormControl = new FormControl();

	constructor(
		private dl: HttpService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private breadcrumb: BreadcrumbService
	) { }

	ngOnInit() {

		console.log('nanannn')
		this.loadTaxItems();
		this.loadMdas();

		this.breadcrumb.setCrumbItem('setupTaxItem');

		this.taxItemForm = this.fb.group({
			id: [''],
			title: ['', Validators.required],
			mda_id: ['', Validators.required],
			rules: ['[]']
		});

		this.searchControl.valueChanges.subscribe((value: string) => {

			console.log("Value changed ", value);

			//	if(this.searching) return;




			if (value.length < 1) {
				this.filteredItems = [...this.taxItems];
			}
			else {

				this.filteredItems = [];
				this.filteredItems = [...this.taxItems];
			}

			let newList: any[] = [];

			value = value.toLowerCase();

			this.filteredItems.forEach((e) => {
				if (e.title && e.title.toLowerCase().indexOf(value) > -1 || e.mda && e.mda.toLowerCase().indexOf(value) > -1 || e.billing_ref && e.billing_ref.toLowerCase().indexOf(value) > -1) {
					newList.push(e);
				}
			});

			this.filteredItems = newList;

		});

	}


	submitTaxItem() {

		if (this.taxItemForm.value.mda_id == null || parseInt(this.taxItemForm.value.mda_id) < 1) {
			return;
		}

		this.loading = true;

		console.log("submitting tax item ", this.taxItemForm.value);

		this.dl.doPost("/tax_items/save", this.taxItemForm.value).subscribe((res) => {
			console.log("result saving", res);
			this.editMode = false;
			this.loading = false;
			this.loadTaxItems();
		}, error => {
			this.loading = false;
			console.log("error saving tax item", error);
		})

	}

	loadTaxItems() {
		this.loading = true;
		// this.dl.doGet("/tax_items/list")
		// 	.subscribe(res => {
		// 		console.log("fetched taxitems ", res);
		// 		this.taxItems = res;
		// 		this.filteredItems = [...this.taxItems];
		// 		this.loading = false;
		// 	},
		// 	(err => {
		// 		this.loading = false;
		// 		console.log("error fetching tax items", err)
		// 	}));

		// this.loading = true;
		this.dl.doGet("/tax_items/list").subscribe(
		(res) => {
			this.taxItems = res;
			// this.filteredItems = [...this.taxItems];
			this.loading = false;
			console.log("fetched taxitems ", res);
		},
		(err) => {
			this.loading = false;
		}
		);
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
				this.dl.doGet("/tax_items/delete/" + id)
					.subscribe(res => {
						this.loading = false;
						this.toastr.success('Tax Item Deleted!', 'Success!', { timeOut: 3000 });
						this.loadTaxItems();
					})
			}, (reason) => {
				this.loading = false;
			});
	}


	editTaxItem(taxItem: any = null) {

		if (taxItem) {
			this.editTitle = "Edit TaxItem";
			this.taxItemForm.setValue({ id: taxItem.id, rules: taxItem.rules, title: taxItem.title, mda_id: taxItem.mda_id });
		}
		else {
			this.editTitle = "Create TaxItem";
			this.taxItemForm.setValue({ title: '', mda_id: '', id: '', rules: '' });
		}

		this.editMode = true;

	}



	parsePhpDate(date: string) {
		return Utils.parsePhpDate(date);
	}
}
