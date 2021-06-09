import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternVisualizerComponent } from './pattern-visualizer.component';

describe('PatternVisualizerComponent', () => {
  let component: PatternVisualizerComponent;
  let fixture: ComponentFixture<PatternVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
