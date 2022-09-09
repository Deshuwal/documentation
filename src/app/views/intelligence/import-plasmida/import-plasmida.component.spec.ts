import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPlasmidaComponent } from './import-plasmida.component';

describe('ImportPlasmidaComponent', () => {
  let component: ImportPlasmidaComponent;
  let fixture: ComponentFixture<ImportPlasmidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPlasmidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPlasmidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
