import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRevenueReturnCorporateComponent } from './previous-revenue-return-corporate.component';

describe('PreviousRevenueReturnCorporateComponent', () => {
  let component: PreviousRevenueReturnCorporateComponent;
  let fixture: ComponentFixture<PreviousRevenueReturnCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousRevenueReturnCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRevenueReturnCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
