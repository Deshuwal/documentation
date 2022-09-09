import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupwtComponent } from './signupwt.component';

describe('SignupwtComponent', () => {
  let component: SignupwtComponent;
  let fixture: ComponentFixture<SignupwtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupwtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupwtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
