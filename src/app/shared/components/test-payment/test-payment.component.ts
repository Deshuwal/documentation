import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbService, IBreadCrumbData } from '../../services/breadcrumb.service';
import { HttpService } from '../../services/http.service';
import { Environment } from 'src/app/shared/models/environment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'test-payment',
  templateUrl: './test-payment.component.html',
  styleUrls: ['./test-payment.component.scss']
})
export class TestPaymentComponent implements OnInit {
  breadItem: IBreadCrumbData;

  @Input()
  billingRef:string;

  loading:boolean = false;

  result_validation:string = "";
  result_notification:string="";

  menvironment:Environment = new Environment();

  @Input()
  amount:number;

  
  displayThisComponent:boolean = false;
  constructor(private httpService:HttpService,   private router: Router, private modalService: NgbModal) {
    
    if(!this.menvironment.isOnLiveServer()){
      this.displayThisComponent= true;
    }
    
  }

  ngOnInit() { 

  }

  payWithNibss(){

    console.log(this.billingRef, this.amount);
    this.validateNibss().then((result:any)=>{

      if(result.status)  this.makePaymentNibss();
    })
    

    
  }

  payWithKudi(){

    console.log(this.billingRef, this.amount);
    this.validateKudi().then((result:any)=>{

      if(result.status)  this.makePaymentKudi();
    })
    

    
  }

  //meta base

  validateKudi(){

    return new Promise((resolve, reject)=>{

    this.loading = true;
    let payLoadValidation:any = {properties:  {PLB1F2ED2999: this.billingRef, PLB1F2ED3000:this.amount, PLB1F2ED2998:"07064920936" }}; 

    this.httpService.doPostPaymentsServer("kudi/validate_invoice", payLoadValidation).subscribe(
      (result)=>{
        this.loading = false;

        this.result_validation = JSON.stringify(result);
        console.log(result, " result from payments server" );
        resolve(result);
    },
    (error:any) =>{
      this.loading = false;
      this.result_validation =    JSON.stringify(error.error);
        reject(error);
    } 
    );

    });
    
  }




  validateNibss(){

    return new Promise((resolve, reject)=>{

    this.loading = true;
    let payLoadValidation:string = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?> <ValidationRequest>  <SourceBankCode>221</SourceBankCode> <SourceBankName>Stanbic IBTC Bank Plc.</SourceBankName> <InstitutionCode>999221</InstitutionCode><ChannelCode>1</ChannelCode><Step>1</Step><StepCount>3</StepCount> <CustomerName>OLADELE OLUWASEUN POPOOLA</CustomerName><CustomerAccountNumber>0021269236</CustomerAccountNumber><BillerID>763</BillerID><BillerName>PSIRS</BillerName><ProductID>984</ProductID><ProductName>IRS Payments</ProductName> <Amount>0.00</Amount> <Param><Key>AnotherParam</Key><Value>CI0554239</Value></Param> <Param> <Key>InvoiceNo</Key><Value>"+this.billingRef+"</Value>  </Param> </ValidationRequest>";

    this.httpService.doPostPaymentsServer("/api/ValidationRequest", payLoadValidation).subscribe(
      (result:any)=>{
        this.loading = false;

        this.result_validation = JSON.stringify(result.text);
        console.log(result, " result from nibss payments server" );
        resolve(result);
    },
    (error:any) =>{
      this.loading = false;

      //NIBSS will throw error even when successful because its xml not json
      let errorS: string = JSON.stringify(error);
      console.log("NIBSS ERROR ", error);
      if(errorS.indexOf("Successful")>-1){
          resolve(error);
      }
      else{
        reject(error);
      }   
      this.result_validation =    JSON.stringify(error.error); 
        

    });
    
  });
}

  makePaymentKudi(){

    this.loading = true;  

   let payLoad =   { "reference": "AAP-COLLECTI-E5F9D-a14a435d-5c84-4c37-a873-"+(Math.random() * 10000), "amount": this.amount,
      "settlement": 450.0,
      "meta": {
          "PLB1F2ED2999": this.billingRef,
          "PLB1F2ED2998": "07035039214",
          "PLB1F2ED3000": this.amount
      },
      "timeCreated": 1645594477571,
      "status": "SUCCESS",
      "customerPhoneNumber": "07035039214",
      "agentData": null,
      "locationData": null
  };

    this.httpService.doPostPaymentsServer("kudi/notify_payment_made", payLoad).subscribe(
      (result:any)=>{
        this.loading = false;

     //   this.result_notification =  JSON.stringify(result.message);
        alert(result.message); 
        this.modalService.dismissAll();
        this.router.navigateByUrl("payment/payment-history");
        console.log(result, " result from payments server" );
    },
    (error:any) =>{
      console.log("ERROR KUDI: ", error);

      alert("ERROR! " + JSON.stringify(error.error));
      this.result_notification  = JSON.stringify(error.error);
   
      this.loading = false;
    } 
  );


  }





  makePaymentNibss(){

    this.loading = true;  

   let payLoad:string = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?> <NotificationRequest>  <SourceBankCode>221</SourceBankCode> <SourceBankName>Stanbic IBTC Bank Plc.</SourceBankName> <InstitutionCode>999221</InstitutionCode><ChannelCode>1</ChannelCode><Step>1</Step><StepCount>3</StepCount> <CustomerName>OLADELE OLUWASEUN POPOOLA</CustomerName><CustomerAccountNumber>0021269236</CustomerAccountNumber><BillerID>763</BillerID><BillerName>PSIRS</BillerName><ProductID>984</ProductID><ProductName>IRS Payments</ProductName> <Amount>0.00</Amount> <Param><Key>AnotherParam</Key><Value>CI0554239</Value></Param> <Param> <Key>InvoiceNo</Key><Value>"+this.billingRef+"</Value>  </Param> </NotificationRequest>";


    this.httpService.doPostPaymentsServer("api/NotificationRequest", payLoad).subscribe(
      (result:any)=>{
        this.loading = false;

     //   this.result_notification =  JSON.stringify(result.message);
        alert(result.message); 
        this.modalService.dismissAll();
        this.router.navigateByUrl("payment/payment-history");
        console.log(result, " result from payments server" );
    },
    (error:any) =>{
      console.log("ERROR NIBSS: ", error);

      let errorS = JSON.stringify(error);
      if(errorS.indexOf("successful") > -1){

        alert("Payment Successful");
        this.modalService.dismissAll();
        this.router.navigateByUrl("payment/payment-history");
        return;
      }

      alert("ERROR! " + JSON.stringify(error.error));
      this.result_notification  = JSON.stringify(error.error);
   
      this.loading = false;
    } 
  );


  }
}
