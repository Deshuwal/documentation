import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndividualBulkAssessmentComponent } from './view-individual-bulk-assessment.component';

describe('DashboardV2Component', () => {
  let component: ViewIndividualBulkAssessmentComponent;
  let fixture: ComponentFixture<ViewIndividualBulkAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIndividualBulkAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIndividualBulkAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
