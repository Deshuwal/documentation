import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Manage_companiesComponent } from "./manage_companies.component";

describe("Manage_companiesComponent", () => {
  let component: Manage_companiesComponent;
  let fixture: ComponentFixture<Manage_companiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Manage_companiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage_companiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
