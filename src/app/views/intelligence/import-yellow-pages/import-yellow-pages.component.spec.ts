import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportYellowPagesComponent } from './import-yellow-pages.component';

describe('ImportYellowPagesComponent', () => {
  let component: ImportYellowPagesComponent;
  let fixture: ComponentFixture<ImportYellowPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportYellowPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportYellowPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
