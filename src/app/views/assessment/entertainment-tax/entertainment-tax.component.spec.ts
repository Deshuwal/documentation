import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentTaxComponent } from './entertainment-tax.component';

describe('EntertainmentTaxComponent', () => {
  let component: EntertainmentTaxComponent;
  let fixture: ComponentFixture<EntertainmentTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertainmentTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertainmentTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
