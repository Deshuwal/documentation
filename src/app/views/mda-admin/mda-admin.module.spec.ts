import { MdaRoutingModule } from './mda-admin-routing-module';

describe('TaxpayerModule', () => {
  let dashboardModule: MdaRoutingModule;

  beforeEach(() => {
    dashboardModule = new MdaRoutingModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
