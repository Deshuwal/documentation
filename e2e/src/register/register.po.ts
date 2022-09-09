import {  by, element, ElementFinder, ProtractorBrowser } from 'protractor'; 
import {Utils} from '../../../src/app/shared/utils'

export class RegistrationPage {
  navigateTo(browser: ProtractorBrowser) {
    return browser.get('/');
  }


  openSelfRegistrationPage(){

    return element(by.css('button[name=signUpWithPhoneNumber]')).click();

  }

  getLandingText() {
    return element(by.css('h1[name=pageTitle]')).getText();
  }

  fillSelfRegistrationData(){

    let first_name = element(by.css('input[name=first_name]'));
    let surname =  element(by.css('input[name=surname]'));
    let phone =  element(by.css('input[name=phone]'));
    let state =  element(by.css('input[name=state]'));
    let lga =  element(by.cssContainingText('option', 'Barkin-Ladi'));
    let password = element(by.css('input[name=password]'));
    let confirm_password = element(by.css('input[name=confirm_password]'));
    let nin = element(by.css('input[name=nin]')); 
  
    
    first_name.sendKeys("Automated");
    surname.sendKeys("Test");
    let random = Math.floor((Math.random() * 1000) + 100);
    phone.sendKeys("0704920936"+random);
    lga.click();
    password.sendKeys("test123");
    confirm_password.sendKeys("test123");

  }


  fillAssistedRegistrationData(browser:ProtractorBrowser){
 
      let first_name =  element(by.css('input[name=first_name]'));
      let surname =  element(by.css('input[name=surname]'));
      let other_names =  element(by.css('input[name=other_names]'));
      let home_town =  element(by.css('input[name=home_town]'));
      let nationality =   element(by.css('ngx-select-dropdown[name=nationality]'));
      let gender =  element(by.cssContainingText('option', 'Male'));
      let marital_status =   element(by.cssContainingText('option', 'Single'));
      let soo =   element(by.cssContainingText('option', 'Plateau'));
      let payer_address =  element(by.css('input[name=payer_address]'));
      let lga =  element(by.css('ngx-select-dropdown[name=lga]'));
      let emp_status =   element(by.css('ngx-select-dropdown[name=emp_status]'));
      let dob =  element(by.css('input[name=dob]'));
      let occuption = element(by.css('ngx-select-dropdown[name=occupation]'));
      let phone =  element(by.css('input[name=phone]'));
      let email =  element(by.css('input[name=email]'));
      let title =  element(by.cssContainingText('option', 'Mr'));
      let nin =  element(by.css('input[name=nin]'));
      let bvn =  element(by.css('input[name=bvn]')); 

      browser.driver.sleep(1000);
      soo.click();
      title.click();
      marital_status.click();
      
      gender.click();
      payer_address.sendKeys("Test Address");
      dob.sendKeys("1994-6-30"); 
      home_town.sendKeys("Nnewi");

      
      first_name.sendKeys("Automated");
      surname.sendKeys("Test");

      let random = Math.floor((Math.random() * 1000) + 100);
      phone.sendKeys("0704920936"+random);
 
 
      Utils.selectForNgxDropDownE2E(browser, nationality, 157);
      Utils.selectForNgxDropDownE2E(browser, occuption, 2);
      Utils.selectForNgxDropDownE2E(browser, emp_status, 2);
      Utils.selectForNgxDropDownE2E(browser, lga, 2);  
      
  }


  getResponseMessage(){
 
    return element(by.className('signup-response')).getText();
  }

 
  doRegistration(){  

      element(by.css('[name=saveUser]')).click(); 
   
  }
   

  getUserMenu(){
 
    return element(by.css('li[name=userRole]')).getText();

  }
}
