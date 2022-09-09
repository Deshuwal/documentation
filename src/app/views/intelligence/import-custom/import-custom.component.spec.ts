import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCustomComponent } from './import-custom.component';

describe('ImportCustomComponent', () => {
  let component: ImportCustomComponent;
  let fixture: ComponentFixture<ImportCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
