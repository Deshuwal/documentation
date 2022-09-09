import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRevenueReturnAssessmentComponent } from './previous-revenue-return-assessment.component';

describe('DashboardV2Component', () => {
  let component: PreviousRevenueReturnAssessmentComponent;
  let fixture: ComponentFixture<PreviousRevenueReturnAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousRevenueReturnAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRevenueReturnAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
