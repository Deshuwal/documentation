import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataCategoryCardComponent } from './create-data-category-card.component';

describe('CreateDataCategoryCard', () => {
  let component: CreateDataCategoryCardComponent;
  let fixture: ComponentFixture<CreateDataCategoryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDataCategoryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDataCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
