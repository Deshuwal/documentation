import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegisteredVehicleComponent } from './previous-mla.component';

describe('DashboardV2Component', () => {
  let component: ViewRegisteredVehicleComponent;
  let fixture: ComponentFixture<ViewRegisteredVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRegisteredVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRegisteredVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
