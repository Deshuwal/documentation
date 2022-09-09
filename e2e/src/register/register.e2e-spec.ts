import { browser, ExpectedConditions } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { RegistrationPage } from './register.po';
import {LoginPage} from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';
describe('Testing Registration...', () => {
  let page: RegistrationPage;
  let data: TestData;
   

  beforeEach(() => {
    page = new RegistrationPage();
    data = new TestData();
  });

   

  it('Register self works', () => {

    

    browser.get(browser.baseUrl+"/#/register/signup");

 
    
    page.fillSelfRegistrationData();
  

    browser.driver.sleep(data.waitLong);

    
    page.doRegistration();

    browser.driver.sleep(data.waitLong);

    expect(page.getResponseMessage()).toContain("successful");
   
 
  
     
  });



  it('Assisted Registration works', () => {

    let loginPage: LoginPage = new LoginPage(); 
    browser.get(browser.baseUrl+"/#/auth/signin");
    loginPage.setUserPassword(data.mdaAdminLoginPassword);
    loginPage.setUserTin(data.mdaAdminLoginPhone);
    loginPage.doLogin(); 

    browser.driver.sleep(data.waitLong);

    browser.get(browser.baseUrl+"#/taxpayer/register-user"); 

    browser.driver.sleep(data.waitLong);
    page.fillAssistedRegistrationData(browser);
 
 
    browser.driver.sleep(data.waitLong);

   page.doRegistration();
   browser.driver.sleep(data.waitLong);
   
   expect(page.getResponseMessage()).toContain("SUCCESS!");
  });

});
