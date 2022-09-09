import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserBulkComponent } from './register-user-bulk.component';

describe('RegisterUserBulkComponent', () => {
  let component: RegisterUserBulkComponent;
  let fixture: ComponentFixture<RegisterUserBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUserBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
