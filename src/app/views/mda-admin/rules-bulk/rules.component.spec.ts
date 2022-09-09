import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesBulkComponent } from './rules.component';

describe('RulesBulkComponent', () => {
  let component: RulesBulkComponent;
  let fixture: ComponentFixture<RulesBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
