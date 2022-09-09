import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualRevenueReturnsComponent } from './individual-revenue-return-tax.component';



describe('IndividualRevenueReturnsComponent', () => {
  let component: IndividualRevenueReturnsComponent;
  let fixture: ComponentFixture<IndividualRevenueReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualRevenueReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRevenueReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
