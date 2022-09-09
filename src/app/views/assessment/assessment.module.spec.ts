import { AssessmentModule } from './assessment.module';

describe('AssessmentModule', () => {
  let dashboardModule: AssessmentModule;

  beforeEach(() => {
    dashboardModule = new AssessmentModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
