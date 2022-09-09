import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../../shared/echart-styles';

import { LocalStoreService } from "../../../shared/services/local-store.service";
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import * as XLSX from 'xlsx';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
@Component({
    selector: 'app-dashboad-default',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css'],
    animations: [SharedAnimations]
})
export class RulesBulkComponent implements OnInit {
    chartLineOption1: EChartOption;
    chartLineOption2: EChartOption;
    chartLineOption3: EChartOption;
    salesChartBar: EChartOption;

    mdas: any;
    taxItemForm: FormGroup;
    taxItems: any;

    public done: boolean = false;

    public loading: boolean = false;
    salesChartPie: EChartOption;

    userProfile: any;

    constructor(
        private localStore: LocalStoreService,
        private toastrService: ToastrService,
        private dl: HttpService,
        private fb: FormBuilder,
        private breadcrumb: BreadcrumbService
    ) { }

    ngOnInit() {

        let profile = this.localStore.getItem("user");
        this.userProfile = profile;

        console.log("retrievied profile", profile);

        this.breadcrumb.setCrumbItem('setupTaxItemBulk');



    }

    file: any;

    fileChanged(e) {
        this.file = e.target.files[0];
    }

    exceltoJson = {};
    isExcelFile: boolean;
    keys: string[];


    submit(file) {

        let data, header;

        const target: DataTransfer = <DataTransfer>(this.file);
        this.isExcelFile = !!this.file.name.match(/(.xls|.xlsx)/);

        var select: any = document.getElementById("input_select");

        if (select.files.length < 1) {
            this.toastrService.error("File not selected", "Please select a file!", { timeOut: 5000, closeButton: true, progressBar: true });
            return;
        }

        if (!this.checkfile("input_select")) {
            this.toastrService.error("Invalid file", "Please select an excel file!", { timeOut: 5000, closeButton: true, progressBar: true });
            return;
        }

        this.loading = true;

        if (this.isExcelFile) {

            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                data = XLSX.utils.sheet_to_json(ws);
                let title = "TAX ITEM";
                let slug = "slug";
                let rules = "Rules";

                for (let item of data) {
                    let rulesToSave = {
                        'title': item[title],
                        'mda_slug': item[slug],
                        'rules': item[rules]
                    }
                    console.log('Rules to Save', rulesToSave);
                    this.dl.doPost("tax_items/save", rulesToSave).subscribe((res) => {
                        console.log("result saving", res);
                        this.loading = true;
                    }, error => {
                        this.loading = false;
                        console.log("error saving tax item", error);
                    });
                }
                console.log('loadef file', data);
            };

            reader.readAsBinaryString(this.file);

            reader.onloadend = (e) => {
                this.loading = false;
            }

        } else {
            this.toastrService.error("Invalid file", "Please select an excel file!", { timeOut: 5000, closeButton: true, progressBar: true });
        }

        setInterval(() => {
            // you have a file
            this.loading = false;
            this.done = true;
            this.toastrService.success("Successful", "Please download result", { timeOut: 5000, closeButton: true, progressBar: true });
            return;

        }, 20000);
    }

    checkfile(id: any) {

        let sender: any = document.getElementById(id);

        var validExts = new Array(".xlsx", ".xls");
        var fileExt = sender.value;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
            return false;
        }
        else return true;
    }


    clickLink(id: string) {

    }

}
