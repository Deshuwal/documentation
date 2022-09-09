import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndividualRevenuReturnAssessmentComponent } from './view-individual-revenue-return-assessment.component';

describe('DashboardV2Component', () => {
  let component: ViewIndividualRevenuReturnAssessmentComponent;
  let fixture: ComponentFixture<ViewIndividualRevenuReturnAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIndividualRevenuReturnAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIndividualRevenuReturnAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
