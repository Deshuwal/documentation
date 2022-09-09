import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeReceiptComponent } from './paye-receipt.component';

describe('BreadcrumbComponent', () => {
  let component:  PayeReceiptComponent ;
  let fixture: ComponentFixture< PayeReceiptComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  PayeReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( PayeReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
