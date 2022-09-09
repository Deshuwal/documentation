import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxItemComponent } from './tax-item.component';

describe('DashboardV2Component', () => {
  let component: TaxItemComponent;
  let fixture: ComponentFixture<TaxItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
