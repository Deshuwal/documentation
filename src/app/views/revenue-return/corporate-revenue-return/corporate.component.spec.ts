import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateRevenueReturnComponent } from './corporate.component';

describe('CorporateRevenueReturnComponent', () => {
  let component: CorporateRevenueReturnComponent;
  let fixture: ComponentFixture<CorporateRevenueReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateRevenueReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateRevenueReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
