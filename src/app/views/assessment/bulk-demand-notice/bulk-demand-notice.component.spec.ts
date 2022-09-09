import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDemandNoticeComponent } from './bulk-demand-notice.component';

describe('BulkDemandNoticeComponent', () => {
  let component: BulkDemandNoticeComponent;
  let fixture: ComponentFixture<BulkDemandNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDemandNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDemandNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
