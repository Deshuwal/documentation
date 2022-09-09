import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterVendorComponent } from "./register_account.component";

describe("RegisterVendorComponent", () => {
  let component: RegisterVendorComponent;
  let fixture: ComponentFixture<RegisterVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterVendorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
