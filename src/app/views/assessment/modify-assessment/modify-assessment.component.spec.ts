import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModifyAssessmentComponent } from "./modify-assessment.component";

describe("ModifyAssessmemntComponent", () => {
  let component: ModifyAssessmentComponent;
  let fixture: ComponentFixture<ModifyAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyAssessmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
