import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRevenueReturnsComponent } from './previous-revenue-returns.component';

describe('DashboardV2Component', () => {
  let component: PreviousRevenueReturnsComponent;
  let fixture: ComponentFixture<PreviousRevenueReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousRevenueReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRevenueReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
