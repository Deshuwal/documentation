import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Manage_usersComponent } from "./manage_users.component";

describe("Manage_usersComponent", () => {
  let component: Manage_usersComponent;
  let fixture: ComponentFixture<Manage_usersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Manage_usersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Manage_usersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
