import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PAYEBulkPaymentComponent } from './bulk_payment.component';

describe('PAYEBulkPaymentComponent', () => {
  let component: PAYEBulkPaymentComponent;
  let fixture: ComponentFixture<PAYEBulkPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PAYEBulkPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PAYEBulkPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});