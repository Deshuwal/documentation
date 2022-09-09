import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDownloadComponent } from './payment_download.component';

describe('PaymentDownloadComponent', () => {
  let component: PaymentDownloadComponent;
  let fixture: ComponentFixture<PaymentDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
