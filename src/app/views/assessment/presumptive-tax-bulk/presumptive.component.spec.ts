import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PresumptiveComponent } from "./presumptive.component";

describe("PaymentComponent", () => {
  let component: PresumptiveComponent;
  let fixture: ComponentFixture<PresumptiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresumptiveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresumptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
