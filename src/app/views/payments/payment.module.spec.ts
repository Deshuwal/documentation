import { PaymentModule } from './payment.module';

describe('TaxpayerModule', () => {
  let dashboardModule: PaymentModule;

  beforeEach(() => {
    dashboardModule = new PaymentModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
