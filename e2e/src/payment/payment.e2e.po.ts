import {  browser, by, element, ElementFinder, promise, ProtractorBrowser } from 'protractor';
import {Utils} from '../../../src/app/shared/utils';
import { LoginPage } from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';
import { resolve } from 'url';

export class PaymentPage {

  data: TestData = new TestData();

  navigateTo(browser: ProtractorBrowser) {
    return browser.get('/#/payment/all');
  }
 
  

  getLandingText() { 
  
    return element(by.css('.page-title')).getText();
  }

 
  openReceipt(){

    return element(by.css('.receipt-button')).click();

  }


  getPreviewPayerName(){

    return element(by.css('.payer-name-preview')).getText();
  }

  getPreviewPayerTin(){  
    return element(by.css('.payer-tin-preview')).getText();
  }

  getPreviewAmount(){ 
    return element(by.css('.amount-preview')).getText();
  }

  getPreviewDescription(){ 
    return element(by.css('.description-preview')).getText();
  }


  getPreviewDate(){

    return element(by.css('.date-issued-preview')).getText();
  }


  selectItemToPayForByName(itemName:string){

    let buttonClass:string = Utils.convertTextToCssSelectorForE2E(itemName); 
    element(by.css("button."+buttonClass)).click(); 
  }



  selectEWalletPaymentChannel( browser:ProtractorBrowser){     
 
    element(by.css(".pay-button")).click(); 
    browser.driver.sleep(this.data.waitMedium);
    element(by.css(".payment-channel")).click(); 
    browser.driver.sleep(this.data.waitShortly);  
    element(by.css('.available-items')).$('.ng-star-inserted').click();  
    browser.driver.sleep(this.data.waitShortly);   
    
   // element.all(by.repeater(".ng-star-inserted")).first().click(); // > ng-star-inserted")).first().click(); 
  }
 
  makePayment(){ 
    
    element(by.css("button.proceed-to-pay")).click(); 

  }

  getListItems():promise.Promise<string>{

    return element(by.css('ngx-datatable')).getText();
  

  }

   
 
}
