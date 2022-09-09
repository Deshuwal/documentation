import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadTaxComponent } from './road-tax.component';

describe('DashboardV2Component', () => {
  let component: RoadTaxComponent;
  let fixture: ComponentFixture<RoadTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
