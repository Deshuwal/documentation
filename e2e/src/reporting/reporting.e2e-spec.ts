import { browser, protractor } from 'protractor'; 
import { PaymentsReportingPage } from './payments-reporting.po'; 
import { UsersReportingPage } from './users-reporting.po';
import { CompaniesReportingPage } from './companies-reporting.po';
import { AssessmentsReportingPage } from './assessments-reporting.po';
import { TestData } from '../helpers/TestData';     
import { LoginPage } from '../sign-in/sign-in.po';
import { ReportingPage } from './reporting.po';

  
describe('Testing  Reports for Payments...', () => {

  let page: ReportingPage;
  let data: TestData; 
 
  let testBillingRef:string = "N-BRN33816844";
  let paymentEndpoint:string = "https://payments.psirs.gov.ng"; 
 

  beforeEach(() => {
   
    data = new TestData();
  });

 
  it('Payment History loads', () => { 
     
    page = new PaymentsReportingPage();
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 
  
    let landingPageText = page.getLandingText(browser);

    expect(landingPageText).toContain("Payment History"); 
    page.getListItemCount().then((itemCount)=>{


        expect(itemCount).toBeGreaterThanOrEqual(2); 

    });

    browser.driver.sleep(data.waitLong); 
  }); 


   



  it('Users List loads', () => { 
     
    page = new UsersReportingPage();
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 
  
    let landingPageText = page.getLandingText(browser);

    expect(landingPageText).toContain("Manage Users"); 
    page.getListItemCount().then((itemCount)=>{

        expect(itemCount).toBeGreaterThanOrEqual(2); 

    });

    browser.driver.sleep(data.waitLong); 
  }); 

 
  it('Companies List loads', () => { 
     
    page = new CompaniesReportingPage();
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 
  
    let landingPageText = page.getLandingText(browser);

    expect(landingPageText).toContain("Manage Company"); 
    page.getListItemCount().then((itemCount)=>{

        expect(itemCount).toBeGreaterThanOrEqual(2); 

    });

    browser.driver.sleep(data.waitLong); 
  }); 



  it('Previous Assessment list loads', () => { 
     
    page = new AssessmentsReportingPage();
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 
  
    let landingPageText = page.getLandingText(browser);

    expect(landingPageText).toContain("My Previous Assessments"); 
    page.getListItemCount().then((itemCount)=>{


        expect(itemCount).toBeGreaterThanOrEqual(2); 

    });

    browser.driver.sleep(data.waitLong); 
  });  


it('Generic Assessment in Payment history page displays title of custom tax item beside Others', () => { 
     
    page = new PaymentsReportingPage();
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


  it('Generic Assessment in Previous Assessment page displays title of custom tax item beside Others', () => { 
     
    page = new AssessmentsReportingPage();
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


  it('Generic Assessment in Assessment history displays title of custom tax item beside Others', () => { 
     
    page = new AssessmentsReportingPage();
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
