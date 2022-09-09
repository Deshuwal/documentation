import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAssessmentComponent } from './previous-assessment.component';

describe('DashboardV2Component', () => {
  let component: PreviousAssessmentComponent;
  let fixture: ComponentFixture<PreviousAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
