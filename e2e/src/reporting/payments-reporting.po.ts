import {  browser, by, element, ElementFinder, promise, ProtractorBrowser } from 'protractor';
import { ReportingPage } from './reporting.po';
import { LoginPage } from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';
import { resolve } from 'url';

export  class PaymentsReportingPage extends ReportingPage {

 

  data: TestData = new TestData();

  navigateTo(browser: ProtractorBrowser):void{  
    browser.get('#/payment/payment-history');
  }
  

   getLandingText() :promise.Promise<string>{ 
    return element(by.css('.page-title')).getText();
  }
   
   
 
  getListItemCount():promise.Promise<number>{
     
    return element.all(by.css('.text-payment-status')).count();  
  }     
 

  getListItems():promise.Promise<string>{

    return element(by.css('ngx-datatable')).getText();
  

  }

   
 
}
