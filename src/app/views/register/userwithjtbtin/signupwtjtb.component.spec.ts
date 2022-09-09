import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupwtJTBComponent } from './signupwtjtb.component';

describe('SignupwtComponent', () => {
  let component: SignupwtJTBComponent;
  let fixture: ComponentFixture<SignupwtJTBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupwtJTBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupwtJTBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
