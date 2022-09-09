import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeComponent } from './paye.component';

describe('PaymentComponent', () => {
  let component: PayeComponent;
  let fixture: ComponentFixture<PayeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
