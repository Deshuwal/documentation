import { browser } from 'protractor';
import { LoginPage } from './sign-in.po';
import { TestData } from '../helpers/TestData';

describe('Testing Login...', () => {
  let page: LoginPage; 
  let data: TestData; 

  beforeEach(() => {
    page = new LoginPage();
    data = new TestData();
  });

   

  it('Sign in as admin works', () => {
    page.navigateTo(browser); 
    page.setUserPassword(data.adminLoginPassword);
    page.setUserTin(data.adminLoginPhone);
    page.doLogin();

    browser.driver.sleep(data.waitMedium);
    let dashboardUrl = browser.baseUrl+"/#/taxpayer/home";
     
    browser.get(dashboardUrl); 
 
    expect(page.getUserMenu()).toEqual("Super Admin"); 

  
  });

  it('Sign in as Mda Admin works', () => {
    page.navigateTo(browser); 
    page.setUserPassword(data.mdaAdminLoginPassword);
    page.setUserTin(data.mdaAdminLoginPhone);
    page.doLogin();

    browser.driver.sleep(data.waitMedium);
    let dashboardUrl = browser.baseUrl+"/#/taxpayer/home";
     
    browser.get(dashboardUrl); 
 
    expect(page.getUserMenu()).toEqual("MDA Admin"); 

  
  });


  it('Sign in as Taxpayer works', () => {
    page.navigateTo(browser); 
    page.setUserPassword(data.taxPayerLoginPassword);
    page.setUserTin(data.taxPayerLoginTin);
    page.doLogin();

    browser.driver.sleep(data.waitMedium);
    let dashboardUrl = browser.baseUrl+"/#/taxpayer/home";
     
    browser.get(dashboardUrl);  
    expect(page.getUserMenu()).toEqual("Taxpayer");  
  });
  


});
