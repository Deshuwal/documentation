import {  browser, by, element, ElementFinder, promise, ProtractorBrowser } from 'protractor';
import {Utils} from '../../../src/app/shared/utils';
import { LoginPage } from '../sign-in/sign-in.po';
import { TestData } from '../helpers/TestData';
import { resolve } from 'url';

export abstract class ReportingPage {

  data: TestData = new TestData();

  abstract navigateTo(ProtractorBrowser): void;
  

  abstract getLandingText(ProtractorBrowser): promise.Promise<string>; 
   
 
  abstract getListItemCount():promise.Promise<number>;   


  abstract getListItems():promise.Promise<string>;  
 
}
