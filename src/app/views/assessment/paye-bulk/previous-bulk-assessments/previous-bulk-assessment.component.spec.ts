import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousBulkAssessmentComponent } from './previous-bulk-assessment.component';

describe('DashboardV2Component', () => {
  let component: PreviousBulkAssessmentComponent;
  let fixture: ComponentFixture<PreviousBulkAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousBulkAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousBulkAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
