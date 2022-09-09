import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditTargetComponent } from "./audit_target.component";

describe("PaymentHistoryComponent", () => {
  let component: AuditTargetComponent;
  let fixture: ComponentFixture<AuditTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTargetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
