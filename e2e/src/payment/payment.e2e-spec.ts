import { browser, protractor } from 'protractor'; 
import { PaymentPage } from './payment.e2e.po'; 
import { TestData } from '../helpers/TestData';     
import { LoginPage } from '../sign-in/sign-in.po';


function makeSimplePostRequest(requestUrl:string, payload:string, username:string  = null, password:string= null){
  
  var request = require('request');   
   
 
  return new Promise((resolve, reject)=>{ 

    var options= {
      headers:{ "Authorization": "Basic cGxhdGVhdS5zcDpmMDI2MDZjNy1kNTFlLTQyZTMtYjVkMy1lOGE2YTAxNzE0Y2Y=", "Content-Type": "application/json"},
      method: 'POST',
      url: requestUrl,
      body: payload
    } 

    var callback = (error, response, body) => {
          if (!error && response.statusCode == 200) {   
              resolve(body);  
          }
          else{   
          }
      }; 

    
     request(options, callback);  

  });

}

function makeSimpleGetRequest(requestUrl:string){
  

  return new Promise((resolve, reject)=>{
 
    var request = require('request');

    var options= {

      headers:{ "Authorization": "Basic cGxhdGVhdS5zcDpmMDI2MDZjNy1kNTFlLTQyZTMtYjVkMy1lOGE2YTAxNzE0Y2Y="},
      method: 'GET',
      url: requestUrl, 
    } 

    var callback = (error, response, body) => {
          if (!error && response.statusCode == 200) { 
 
              resolve(body);  
          }
          else{  
              reject(body);
          }
      }; 

    
     request(options, callback);  

  }); 
}

describe('Testing Payment...', () => {

  let page: PaymentPage;
  let data: TestData; 
 
  let testBillingRef:string = "N-BRN33816844";
  let paymentEndpoint:string = "https://payments.psirs.gov.ng"; 
 

  beforeEach(() => {
    page = new PaymentPage();
    data = new TestData();
  });

 
  it('Payment page loads', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 
 
     
    let landingPageText = page.getLandingText();

    expect(landingPageText).toContain("Make and Review Payments");
    
  }); 

  
  it('Mda admin can pay for taxpayer via e-wallet and view receipt', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();  

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitLong); 
 
     
    page.selectItemToPayForByName("Others -Automated Test");
    //expect(page.selectItemToPayForByName("Others -Automated Test")).toContain("Others -Automated Test");
    browser.driver.sleep(data.waitShortly);  
    page.selectEWalletPaymentChannel(browser);
    browser.driver.sleep(data.waitShortly);
    page.makePayment();
    browser.driver.sleep(data.waitLong);
    

    expect(
      browser.wait(
        protractor.ExpectedConditions.urlContains("payment-history"), data.waitMedium
      ).catch(() => {return false})
      ); 
  
    browser.driver.manage().window().maximize();    
    page.openReceipt(); 
    expect(page.getPreviewPayerName()).not.toBe(''); 
  }); 
 







  it('NIBSS Payment API is up and listening', () => { 

    //page.navigateTo(browser);
    var request = require('request');
 
 
    makeSimplePostRequest(paymentEndpoint+"/api/ValidationRequest", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <ValidationRequest> <SourceBankCode>221</SourceBankCode> <SourceBankName>Stanbic IBTC Bank Plc.</SourceBankName> <InstitutionCode>999221</InstitutionCode> <ChannelCode>1</ChannelCode> <Step>1</Step> <StepCount>3</StepCount> <CustomerName>OLADELE OLUWASEUN POPOOLA</CustomerName> <CustomerAccountNumber>0021269236</CustomerAccountNumber> <BillerID>763</BillerID><BillerName>PSIRS</BillerName>  <ProductID>984</ProductID> <ProductName>IRS Payments</ProductName><Amount>0.00</Amount> <Param> <Key>AnotherParam</Key> <Value>CI0554239</Value></Param> <Param> <Key>InvoiceNo</Key><Value>'+testBillingRef+'</Value></Param> </ValidationRequest>').then((resp:string)=>{ 
        expect(resp).toContain("Validation Successful"); 
    },(err:string) =>{ 
      expect(err).toContain("Validation Successful"); 
    }); 


    makeSimplePostRequest(paymentEndpoint+"/api/NotificationRequest", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <NotificationRequest> <SessionID>999221210603094749436833852076</SessionID> <SourceBankCode>221</SourceBankCode>  <SourceBankName>Stanbic IBTC Bank Plc.</SourceBankName> <ChannelCode>1</ChannelCode> <CustomerName>OLADELE OLUWASEUN POPOOLA</CustomerName>  <CustomerAccountNumber>0021269236</CustomerAccountNumber> <BillerID>767</BillerID> <BillerName>PSIRS Plateau state IRS</BillerName> <ProductID>997</ProductID> <ProductName>IRS Payments</ProductName>  <Amount>200.00</Amount> <TotalAmount>200.00</TotalAmount> <Fee>0.00</Fee>  <TransactionFeeBearer>biller</TransactionFeeBearer> <SplitType>none</SplitType> <DestinationBankCode>058</DestinationBankCode> <Narration>e-BillsPay Collection</Narration>  <PaymentReference>eBillsPay/1622710069817</PaymentReference>  <TransactionInitiatedDate>1622710069000</TransactionInitiatedDate> <TransactionApprovalDate>1622674800000</TransactionApprovalDate> <Param> <Key>Email</Key> <Value>NA</Value> </Param> <Param><Key>Payment Status</Key><Value>Unpaid</Value></Param><Param><Key>Amount</Key><Value>100</Value></Param><Param><Key>InvoiceNo</Key> <Value>'+testBillingRef+'</Value></Param><Param><Key>TotalAmount</Key><Value>200</Value></Param><Param><Key>ChargeFee</Key><Value>100</Value></Param><Param><Key>CustomerCategory</Key><Value>TaxPayer</Value></Param><Param><Key>Invoice Number</Key> <Value>'+testBillingRef+'</Value></Param><Param><Key>PhoneNumber</Key><Value>07064920936</Value></Param><Param><Key>Charge Fee</Key><Value>100</Value></Param><Param><Key>Total Amount</Key><Value>200</Value></Param><Param><Key>CustomerName</Key><Value>Hilary Okeke</Value></Param><Param><Key>InvoiceNumber</Key><Value>'+testBillingRef+'</Value></Param><Param><Key>Phone Number</Key> <Value>07064920936</Value></Param><Param><Key>Customer Category</Key><Value>TaxPayer</Value></Param><Param><Key>Customer Name</Key> <Value>Hilary Okeke</Value></Param><Param><Key>PaymentStatus</Key><Value>Unpaid</Value></Param><Param> <Key>Email Address</Key> <Value>NA</Value> </Param> </NotificationRequest>').then((resp:string)=>{ 
      expect(resp).toContain("was successful"); 
  },(err:string) =>{ 
    expect(err).toContain("was successful"); 
  }); 
    browser.driver.sleep(data.waitLong);  
}); 


  it('Kudi Payment API is up and listening', () => { 
      //  page.navigateTo(browser);
        var request = require('request');
 

         makeSimplePostRequest(paymentEndpoint+"/kudi/validate_invoice", '{ "properties" : { "PLB1F2ED2999":"N-BRN33816844" } }').then((resp:string) =>{

              expect(resp).toContain("Customer with Identity Number found");   
         }, (err:string) =>{ 
              expect(err).toContain("Customer with Identity Number found");   
          });

         makeSimplePostRequest(paymentEndpoint+"/kudi/notify_payment_made", '{"amount": 200.0, "settlement":190.0, "meta": {"PLB1F2ED2999": "N-BRN23293365", "PLB1F2ED3000": 11250, "PLB1F2ED2998": "07064920936"}, "reference": "AAP-INSURANC-D82BF-a58e9a081-fda3-4e7c-bf70-15fbde47342b","status": "SUCCESS", "timeCreated": "2021-01-24T10:21:31.702+0000" }').then((resp:string)=>{

            expect(resp).toContain("Payment already reported"); 
         }, (err:string) =>{ 
            expect(err).toContain("Payment already reported");   
         }); 


        browser.driver.sleep(data.waitLong); 
 
  }); 
 



  it('MTN Payment API is up and listening', () => { 

   // page.navigateTo(browser);
    var request = require('request');

    let mtnPaymentEndpoint = "http://18.134.166.205";

    makeSimpleGetRequest(mtnPaymentEndpoint+"/Mtn/validate_invoice/N-BRN33816844").then((resp:string) =>{ 
          expect(resp).toContain("payment_type");   
    }, (err:string) =>{ 
          expect(err).toContain("payment_type");   
    });

    makeSimplePostRequest(mtnPaymentEndpoint+"/Mtn/notify_payment_made", '"billing_ref":"N-BRN33816844","mtn_reference":"N-BRN33816844"}').then((resp:string)=>{ 
        expect(resp).toContain("Payment already reported"); 
    },(err:string) =>{ 
      expect(err).toContain("Invoice id");   
    }); 
    browser.driver.sleep(data.waitLong * 2);  

});

 


it('Paydirect Payment API is up and listening', () => { 
  //page.navigateTo(browser);
  var request = require('request');


   makeSimplePostRequest(paymentEndpoint+"/payDirect/xml", '<CustomerInformationRequest><ServiceUsername><ServiceUsername><ServicePassword></ServicePassword><MerchantReference>8144</MerchantReference><CustReference>N-BRN74766255</CustReference><PaymentItemCode>01</PaymentItemCode><ThirdPartyCode></ThirdPartyCode></CustomerInformationRequest>').then((resp:string) =>{ 
        expect(resp).toContain("Unauthorized IP");   
   }, (err:string) =>{ 
        expect(err).toContain("Unauthorized IP");   
    });

   makeSimplePostRequest(paymentEndpoint+"/payDirect/xml", '<PaymentNotificationRequest xmlns:ns2="http://techquest.interswitchng.com/" xmlns:ns3="http://www.w3.org/2003/05/soap-envelope"><ServiceUrl>https://payments.psirs.gov.ng payDirect/xml</ServiceUrl><ServiceUsername></ServiceUsername><ServicePassword></ServicePassword><FtpUrl></FtpUrl><FtpUsername></FtpUsername><FtpPassword></FtpPassword><Payments><Payment><PaymentLogId>2344343430311</PaymentLogId><CustReference>14180</CustReference><AlternateCustReference></AlternateCustReference><Amount>300</Amount><PaymentMethod>Debit Card</PaymentMethod><PaymentReference>BOND|TEST|BRH|2021-06-08|123090998</PaymentReference><TerminalId></TerminalId><ChannelName>Bank Branc</ChannelName><Location></Location><PaymentDate>08/18/2021 09:17:36</PaymentDate><InstitutionId>TEST</InstitutionId><InstitutionName>TEST</InstitutionName><BranchName>TEST</BranchName><BankName>Bond Bank</BankName><CustomerName></CustomerName><OtherCustomerInfo>|</OtherCustomerInfo><ReceiptNo>23424367</ReceiptNo><CollectionsAccount>209072227001000100</CollectionsAccount><BankCode>BOND</BankCode><CustomerAddress></CustomerAddress><CustomerPhoneNumber></CustomerPhoneNumber><DepositorName></DepositorName><DepositSlipNumber>333489</DepositSlipNumber><PaymentCurrency>566</PaymentCurrency><PaymentItems><PaymentItem><ItemName>TEST</ItemName><ItemCode>101</ItemCode><ItemAmount>300</ItemAmount><LeadBankCode>WEMA</LeadBankCode><LeadBankCbnCode>035</LeadBankCbnCode> <LeadBankName>WEMA Bank Plc</LeadBankName><CategoryCode>100010011110000</CategoryCode> <CategoryName>MINISTRY OF AGRICULTURE</CategoryName></PaymentItem></PaymentItems> <ProductGroupCode>HTTPGENERIC</ProductGroupCode><PaymentStatus>0</PaymentStatus><IsReversal>False</IsReversal><SettlementDate>08/19/2021 12:00:36</SettlementDate><FeeName></FeeName><ThirdPartyCode>TEST</ThirdPartyCode><OriginalPaymentReference></OriginalPaymentReference><OriginalPaymentLogId></OriginalPaymentLogId><Teller> Oluwaranti Adebowale</Teller></Payment></Payments></PaymentNotificationRequest>').then((resp:string)=>{ 
      expect(resp).toContain("Unauthorized IP"); 
   }, (err:string) =>{ 
      expect(err).toContain("Unauthorized IP");   
   });  
  browser.driver.sleep(data.waitLong); 

}); 



 
 
it('Generic Assessment in Make Payments Page  displays title of custom tax item beside Others', () => { 
     
  page = new PaymentPage();
  let login: LoginPage = new LoginPage();
  login.navigateTo(browser);
  login.setUserPassword(data.mdaAdminLoginPassword);
  login.setUserTin(data.mdaAdminLoginPhone);
  login.doLogin();

  browser.driver.sleep(data.waitTimeForLogin); 

  page.navigateTo(browser);  
  browser.driver.sleep(data.waitTimeLoadDashboard); 

  page.getListItems().then((itemsText:string)=>{

    expect(itemsText.length).toBeGreaterThan(10);

    if(itemsText.indexOf("Others") > 1){
      expect(itemsText).toContain("Others -");  
    }

    browser.driver.sleep(data.waitLong); 

  })

}); 


  
});
