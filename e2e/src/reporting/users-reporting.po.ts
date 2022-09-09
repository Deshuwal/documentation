import {  browser, by, element, ElementFinder, promise, ProtractorBrowser } from 'protractor';
import { ReportingPage } from './reporting.po';
import { LoginPage } from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';
import { resolve } from 'url';

export  class UsersReportingPage extends ReportingPage {
  getListItems(): promise.Promise<string> {
    throw new Error('Method not implemented.');
  }

 
  data: TestData = new TestData();

  navigateTo(browser: ProtractorBrowser):void{  
    browser.get('#/setup/assign-role');
  }
  

   getLandingText() :promise.Promise<string>{ 
    return element(by.css('.page-title')).getText();
  }
   
   
 
  getListItemCount():promise.Promise<number>{
    
   // let elem:ElementFinder = element(by.css(".data-table-view"));
    return element.all(by.css('.user-item-actions')).count();  
  }   
 

   
 
}
