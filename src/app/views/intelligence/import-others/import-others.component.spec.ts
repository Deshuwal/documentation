import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOthersComponent } from './import-others.component';

describe('ImportOthersComponent', () => {
  let component: ImportOthersComponent;
  let fixture: ComponentFixture<ImportOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
