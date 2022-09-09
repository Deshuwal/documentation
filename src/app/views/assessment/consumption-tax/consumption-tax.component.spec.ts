import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionTaxComponent } from './consumption-tax.component';

describe('ConsumptionTaxComponent', () => {
  let component: ConsumptionTaxComponent;
  let fixture: ComponentFixture<ConsumptionTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
