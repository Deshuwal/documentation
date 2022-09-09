import {  browser, by, element, ElementFinder, ProtractorBrowser } from 'protractor'; 
import { LoginPage } from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';

export class AssessmentPage {

  data: TestData = new TestData();

  navigateTo(browser: ProtractorBrowser) {
    return browser.get('/#/assessment/perform');
  }
 
  

  getLandingText() { 
  
    return element(by.css('.page-title')).getText();
  }


  setAssistedAssessmentTin(tin:string,  browser: ProtractorBrowser){
    
    element(by.css(".payer-tin")).click(); 
    browser.driver.sleep(this.data.waitShortly);
    element(by.css("input[role=combobox]")).sendKeys(tin);
    browser.driver.sleep(this.data.waitShortly);
    element.all(by.css("span.ng-option-label")).first().click();
  

  }

  setSelfAssessmentTin(tin:string,  browser: ProtractorBrowser){
    
    element(by.css(".payer-tin")).click(); 
    browser.driver.sleep(1000);
    element(by.css(".available-items")).element(by.css(".ng-star-inserted")).click();
  

  }

  setAssessmentMDA(mdaName:string, browser:ProtractorBrowser, data:TestData){


    let mda =  element(by.cssContainingText('option', mdaName));
    browser.driver.sleep(data.waitShortly);
    mda.click();
  }


  setTaxItem(taxItemName:string){


    let taxItem =  element(by.cssContainingText('option', taxItemName));
    taxItem.click();

  }

  setGenericTaxItem(amount: number, description:string){

    let taxItem =  element(by.cssContainingText('option', "Others"));
    taxItem.click();

    element(by.css(".others-amount")).sendKeys(amount);
    element(by.css(".others-description")).sendKeys(description);

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
  performAssessment(){

    element(by.cssContainingText('button', 'Generate Assessment')).click();

  }

  acceptTerms(){


    element(by.css('.accept-terms')).click();

  }
 
}
