import { TaxpayerModule } from './taxpayer.module';

describe('TaxpayerModule', () => {
  let dashboardModule: TaxpayerModule;

  beforeEach(() => {
    dashboardModule = new TaxpayerModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
