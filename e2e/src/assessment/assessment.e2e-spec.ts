import { browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { AssessmentPage } from './assessment.e2e.po'; 
import { TestData } from '../helpers/TestData';
import  { LoginPage } from '../sign-in/sign-in.po'; 
import moment from 'moment';

describe('Testing Assessment...', () => {
  let page: AssessmentPage;
  let data: TestData;

   

  beforeEach(() => {
    page = new AssessmentPage();
    data = new TestData();
  });
 


  it('Perform  generic self assessment as taxpayer and display correct name, tin, amount, tax item and issue date on preview', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.taxPayerLoginPassword);
    login.setUserTin(data.taxPayerLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitLong); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitLong); 

    page.acceptTerms();
    
    let landingPageText = page.getLandingText();

    expect(landingPageText).toContain("Perform Assessment");

    page.setSelfAssessmentTin(data.taxPayerLoginTin, browser);
    page.setAssessmentMDA("PLATEAU STATE INTERNAL REVENUE SERVICE", browser, data); 
    page.setGenericTaxItem(500, "Automated Test"); 
    page.performAssessment();

    browser.driver.sleep(data.waitLong);  
 
    expect(page.getPreviewPayerName()).toContain("Test Taxpayer"); 
    expect(page.getPreviewPayerTin()).toEqual(data.taxPayerLoginTin);
    expect(page.getPreviewAmount()).toEqual('500');
    expect(page.getPreviewDescription()).toContain("Automated Test");

    let now = new Date();
    var dateString = moment(now). format('D-MM-YYYY'); 
     expect(page.getPreviewDate()).toEqual(dateString);
  }); 

  
 
/*
 
  it('Perform assisted generic assessment for non-migrated INDIVIDUAL and display correct name, tin, amount, tax item and issue date on preview modal', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 

    page.acceptTerms();
      

    page.setAssistedAssessmentTin(data.unmigratedTaxPayerTin, browser);
    browser.driver.sleep(data.waitShortly);

    page.setAssessmentMDA("PLATEAU STATE INTERNAL REVENUE SERVICE", browser, data); 
    page.setGenericTaxItem(500, "Automated Test"); 

    page.performAssessment(); 
    browser.driver.sleep(data.waitLong); 
 
    expect(page.getPreviewPayerName()).toContain(data.unmigratedTaxPayerName); 
    expect(page.getPreviewPayerTin()).toEqual(data.unmigratedTaxPayerTin);
    expect(page.getPreviewAmount()).toEqual('500');
    expect(page.getPreviewDescription()).toContain("Automated Test");

    let now = new Date();
    var dateString = moment(now). format('D-MM-YYYY'); 
     expect(page.getPreviewDate()).toEqual(dateString);  
  });


  it('Perform assisted generic assessment for non-migrated COMPANY and display correct name, tin, amount, tax item and issue date on preview modal', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitTimeForLogin); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitTimeLoadDashboard); 

    page.acceptTerms();
      

    page.setAssistedAssessmentTin(data.unmigratedCompanyTin, browser); 
    page.setAssessmentMDA("PLATEAU STATE INTERNAL REVENUE SERVICE", browser, data); 
    page.setGenericTaxItem(500, "Automated Test");


    page.performAssessment(); 
    browser.driver.sleep(data.waitLong); 
 
    expect(page.getPreviewPayerName()).toContain(data.unmigratedCompanyName); 
    expect(page.getPreviewPayerTin()).toEqual(data.unmigratedCompanyTin);
    expect(page.getPreviewAmount()).toEqual('500');
    expect(page.getPreviewDescription()).toContain("Automated Test");

    let now = new Date();
    var dateString = moment(now). format('D-MM-YYYY'); 
     expect(page.getPreviewDate()).toEqual(dateString);  
  });
*/
 
  it('Perform assisted generic assessment for migrated COMPANY and display correct name, tin, amount, tax item and issue date on preview modal', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitShortly); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitShortly); 

    page.acceptTerms(); 
    browser.driver.sleep(data.waitShortly);
    page.setAssistedAssessmentTin(data.migratedCompanyTin, browser); 
    page.setAssessmentMDA("PLATEAU STATE INTERNAL REVENUE SERVICE", browser, data);  
    page.setGenericTaxItem(500, "Automated Test");   
    page.performAssessment();   
    browser.driver.sleep(data.waitShortly); 

    expect(page.getPreviewPayerName()).toContain(data.migratedCompanyName); 
    browser.driver.sleep(data.waitShortly);
    expect(page.getPreviewPayerTin()).toEqual(data.migratedCompanyTin);
    browser.driver.sleep(data.waitShortly);
    expect(page.getPreviewAmount()).toEqual('500');
    browser.driver.sleep(data.waitShortly);
    expect(page.getPreviewDescription()).toContain("Automated Test");
    browser.driver.sleep(data.waitShortly);

    let now = new Date();
    var dateString = moment(now). format('D-MM-YYYY'); 
    expect(page.getPreviewDate()).toEqual(dateString);  

    browser.driver.sleep(data.waitShortly);     
 
  });
 

  it('Perform self assessment as MDA admin and display correct name, tin, amount, tax item and issue date on preview modal', () => { 
     
    let login: LoginPage = new LoginPage();
    login.navigateTo(browser);
    login.setUserPassword(data.mdaAdminLoginPassword);
    login.setUserTin(data.mdaAdminLoginPhone);
    login.doLogin();

    browser.driver.sleep(data.waitLong); 

    page.navigateTo(browser);  
    browser.driver.sleep(data.waitLong); 

    page.acceptTerms();
      

    page.setAssistedAssessmentTin(data.mdaAdminLoginTin, browser); 
    page.setAssessmentMDA("PLATEAU STATE INTERNAL REVENUE SERVICE", browser, data); 
    page.setGenericTaxItem(500, "Automated Test");


    page.performAssessment(); 
    browser.driver.sleep(data.waitShortly); 
 
    expect(page.getPreviewPayerName()).toContain(data.mdaAdminName); 
    expect(page.getPreviewPayerTin()).toEqual(data.mdaAdminLoginTin);
    expect(page.getPreviewAmount()).toEqual('500');
    expect(page.getPreviewDescription()).toContain("Automated Test");

    let now = new Date();
    var dateString = moment(now). format('D-MM-YYYY'); 
     expect(page.getPreviewDate()).toEqual(dateString);  
  });

});
