import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresumtiveTaxComponent } from './presumtive-tax.component';

describe('DashboardV2Component', () => {
  let component: PresumtiveTaxComponent;
  let fixture: ComponentFixture<PresumtiveTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresumtiveTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresumtiveTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
