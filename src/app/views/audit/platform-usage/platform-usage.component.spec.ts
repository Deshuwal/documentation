import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUsageComponent } from './platform-usage.component';

describe('PlatformUsageComponent', () => {
  let component: PlatformUsageComponent;
  let fixture: ComponentFixture<PlatformUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
