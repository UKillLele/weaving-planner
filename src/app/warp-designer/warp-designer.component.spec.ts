import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarpDesignerComponent } from './warp-designer.component';

describe('WarpDesignerComponent', () => {
  let component: WarpDesignerComponent;
  let fixture: ComponentFixture<WarpDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarpDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarpDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
