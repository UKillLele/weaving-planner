import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeftDesignerComponent } from './weft-designer.component';

describe('WeftDesignerComponent', () => {
  let component: WeftDesignerComponent;
  let fixture: ComponentFixture<WeftDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeftDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeftDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
