import { FnParam } from '@angular/compiler/src/output/output_ast';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityComponent } from './activity.component';

/**
 * @param  {} 'ActivityComponent'
 * @param  {} (
 * @param  {ActivityComponent;letfixture:ComponentFixture<ActivityComponent>;beforeEach(async((} =>{letcomponent
 */
describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  /**
   * @param  {} async((
   * @param  {[ActivityComponent]}} =>{TestBed.configureTestingModule({declarations
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityComponent ]
    })
    .compileComponents();
  }));
  /**
   * @param  {} (
   * @param  {} =>{fixture=TestBed.createComponent(ActivityComponent
   * @param  {} ;component=fixture.componentInstance;fixture.detectChanges(
   * @param  {} ;}
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * @param  {} 'shouldcreate'
   * @param  {} (
   * @param  {} =>{expect(component
   * @param  {} .toBeTruthy(
   * @param  {} ;}
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
