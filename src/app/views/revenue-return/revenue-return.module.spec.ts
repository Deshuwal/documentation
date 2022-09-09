import { RevenueReturnRoutingModule } from './revenue-return-routing-module';

describe('RevenueReturnModule', () => {
  let dashboardModule: RevenueReturnRoutingModule;

  beforeEach(() => {
    dashboardModule = new RevenueReturnRoutingModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
