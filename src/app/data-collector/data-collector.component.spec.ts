import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectorComponent } from './data-collector.component';

describe('DataCollectorComponent', () => {
  let component: DataCollectorComponent;
  let fixture: ComponentFixture<DataCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCollectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
