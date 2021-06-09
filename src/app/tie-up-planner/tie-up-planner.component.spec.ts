import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpPlannerComponent } from './tie-up-planner.component';

describe('TieUpPlannerComponent', () => {
  let component: TieUpPlannerComponent;
  let fixture: ComponentFixture<TieUpPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieUpPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TieUpPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
