import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportCacComponent } from './import-cac.component';

describe('ImportCacComponent', () => {
  let component: ImportCacComponent;
  let fixture: ComponentFixture<ImportCacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
