import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getLandingText() {
    return element(by.tagName('h1')).getText();
  }
 
}
