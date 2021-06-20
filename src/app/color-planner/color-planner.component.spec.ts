import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPlannerComponent } from './color-planner.component';

describe('ColorPlannerComponent', () => {
  let component: ColorPlannerComponent;
  let fixture: ComponentFixture<ColorPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
