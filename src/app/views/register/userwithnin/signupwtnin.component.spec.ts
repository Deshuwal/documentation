import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupwtNINComponent } from './signupwtnin.component';

describe('SignupwtComponent', () => {
  let component: SignupwtNINComponent;
  let fixture: ComponentFixture<SignupwtNINComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupwtNINComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupwtNINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
