import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorLicenseAuthority } from './mla.component';

describe('DashboardV2Component', () => {
  let component: MotorLicenseAuthority;
  let fixture: ComponentFixture<MotorLicenseAuthority>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorLicenseAuthority ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorLicenseAuthority);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
