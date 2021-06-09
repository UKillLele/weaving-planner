import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreadlingPlannerComponent } from './treadling-planner.component';

describe('TreadlingPlannerComponent', () => {
  let component: TreadlingPlannerComponent;
  let fixture: ComponentFixture<TreadlingPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreadlingPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreadlingPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
