import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { echartStyles } from '../../../shared/echart-styles';

import { LocalStoreService } from "../../../shared/services/local-store.service";
import { ToastrService } from 'ngx-toastr';

import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { HttpService } from '../../../shared/services/http.service';
import { Utils } from '../../../shared/utils';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
    selector: 'app-dashboad-default',
    templateUrl: './wallet.component.html',

    animations: [SharedAnimations],
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
    chartLineOption1: EChartOption;
    chartLineOption2: EChartOption;
    chartLineOption3: EChartOption;
    salesChartBar: EChartOption;

    public done: boolean = false;

    public loading: boolean = false;
    salesChartPie: EChartOption;

    userProfile: any;
    wallet: string;
    fund_amount: number;





    @ViewChild('modalConfirm', { static: false }) private modalContent;

    constructor(
        private httpService: HttpService,
        private localStore: LocalStoreService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private breadcrumb: BreadcrumbService
    ) { }

    ngOnInit() {

        let profile = this.localStore.getItem("user");
        this.userProfile = profile;
        this.breadcrumb.setCrumbItem('paymentWallet');
        this.getBalance();

        console.log("retrievied profile", profile);

    }

    makeDeposit() {


        if (this.payment_method != "debit_card") {
            this.toastrService.error("Error", "Select payment method");
            return;
        }

        this.modalService.dismissAll("dismisse");
        let amount: number = this.fund_amount;



        let win: any = window;
        win.payWithPaystack(amount, this);
        console.log("Called paystack");

    }


    paymentSucceeded() {

        this.loading = true;

        let url: string = "payments/credit_wallet/" + this.userProfile.id + "/" + this.fund_amount;
        console.log("url is ", url);
        this.httpService.doGet(url).subscribe((res) => {

            this.loading = false;
            this.toastrService.success("Success", "Payment Successful!", { timeOut: 10000, closeButton: true, progressBar: true });
            this.modalService.dismissAll("dismiss");
            this.getBalance();


        },
            err => {

                this.loading = false;
                this.toastrService.error("Failed!", "Payment Failed", { timeOut: 10000, closeButton: true, progressBar: true });
                this.modalService.dismissAll("dismiss");
            }
        );

    }

    modal: NgbModal;
    payment_method: string;

    openConfirmModal() {
        this.modalService.open(this.modalContent, { ariaLabelledBy: 'Deposit Fund into wallet' })
            .result.then((result) => {
                this.modal = result;
                console.log(result);
            }, (reason) => {
                console.log('Err!', reason);
            });
    }


    makePayment() {


    }
    getBalance() {

        let url: string = "payments/get_wallet/" + this.userProfile.id;
        this.loading = true;
        this.httpService.doGet(url).subscribe((res: any) => {

            console.log("gotten wallet", res);
            this.wallet = res.account_balance;
            console.log("wallet is ", this.wallet);
            this.loading = false;

        },

            (err) => {

                console.log("error getting ", err);
                this.loading = false;
            }
        );
    }



    format_number(mNumber: number) {
        return Utils.formatNumber(mNumber);
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
