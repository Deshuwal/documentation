import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalIncomeTaxComponent } from './personal-income-tax.component';

describe('PersonalIncomeTaxComponent', () => {
  let component: PersonalIncomeTaxComponent;
  let fixture: ComponentFixture<PersonalIncomeTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalIncomeTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalIncomeTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
