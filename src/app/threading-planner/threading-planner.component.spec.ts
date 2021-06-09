import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadingPlannerComponent } from './threading-planner.component';

describe('ThreadingPlannerComponent', () => {
  let component: ThreadingPlannerComponent;
  let fixture: ComponentFixture<ThreadingPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadingPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadingPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
