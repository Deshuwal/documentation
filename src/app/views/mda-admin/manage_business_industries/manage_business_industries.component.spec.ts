import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageBusinessIndustriesComponent } from "./manage_business_industries.component";

describe("ManageBusinessIndustriesComponent", () => {
  let component: ManageBusinessIndustriesComponent;
  let fixture: ComponentFixture<ManageBusinessIndustriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBusinessIndustriesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBusinessIndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
