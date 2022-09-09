import { AppPage } from './app.po';

describe('PSIRS Portal Home', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Home page loads', () => {
    page.navigateTo();
    let landingPageText = page.getLandingText();
    expect(landingPageText).toEqual('Sign In');
  });
});
