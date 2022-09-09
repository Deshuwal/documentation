import { ProtractorBrowser, by, element } from 'protractor';

export class LoginPage {
  navigateTo(browser: ProtractorBrowser) {
    return browser.get('/');
  }

  getLandingText() {
    return element(by.tagName('h1')).getText();
  }

  setUserTin(tin:string){
    // element(by.css('input[formcontrolname="user"]')).sendKeys(tin);
  }


  setUserPassword(pass: string){ 
    // element(by.css('input[formcontrolname="password"]')).sendKeys(pass);
  }


  doLogin(){ 
    return element(by.css('button[type=submit]')).click();
  }
   

  getUserMenu(){
 
    return element(by.css('li[name=userRole]')).getText();

  }
}
