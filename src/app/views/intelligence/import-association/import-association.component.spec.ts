import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAssociationComponent } from './import-association.component';

describe('ImportAssociationComponent', () => {
  let component: ImportAssociationComponent;
  let fixture: ComponentFixture<ImportAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
