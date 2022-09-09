import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdaBulkComponent } from './mda-bulk.component';

describe('PaymentComponent', () => {
  let component: MdaBulkComponent;
  let fixture: ComponentFixture<MdaBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdaBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdaBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
