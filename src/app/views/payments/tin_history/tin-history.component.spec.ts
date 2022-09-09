import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TINHistoryComponent } from './tin-history.component';

describe('TINHistoryComponent', () => {
  let component: TINHistoryComponent;
  let fixture: ComponentFixture<TINHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TINHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TINHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
