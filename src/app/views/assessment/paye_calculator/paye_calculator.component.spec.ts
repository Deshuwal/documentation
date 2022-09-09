import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Paye_calculatorComponent } from "./paye_calculator.component";

describe("DashboardV2Component", () => {
  let component: Paye_calculatorComponent;
  let fixture: ComponentFixture<Paye_calculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Paye_calculatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Paye_calculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
