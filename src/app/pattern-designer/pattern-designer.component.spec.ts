import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternDesignerComponent } from './pattern-designer.component';

describe('PatternDesignerComponent', () => {
  let component: PatternDesignerComponent;
  let fixture: ComponentFixture<PatternDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
