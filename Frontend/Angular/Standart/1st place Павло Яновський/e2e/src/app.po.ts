import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getMatInputValue() {
    return element(by.css('app-root app-main input')).getAttribute('value') as Promise<string>;
  }
}
