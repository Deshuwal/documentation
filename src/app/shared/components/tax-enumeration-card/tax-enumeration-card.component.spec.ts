import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxEnumerationCardComponent } from './tax-enumeration-card.component';

describe('TaxEnumerationCardComponent', () => {
  let component: TaxEnumerationCardComponent;
  let fixture: ComponentFixture<TaxEnumerationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxEnumerationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxEnumerationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
