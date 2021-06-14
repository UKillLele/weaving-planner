import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-treadling-planner',
  templateUrl: './treadling-planner.component.html',
  styleUrls: ['./treadling-planner.component.scss']
})
export class TreadlingPlannerComponent implements OnInit, OnChanges {

  @Input() treadles: number = 0;
  @Input() patternLength: number = 0;
  @Output() treadlingBoxesEvent = new EventEmitter<box[]>();
  treadlingBoxes: box[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.treadlingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.treadles * this.patternLength;
    for (let i = 1; i <= cells; i++) {
      let x: box = {
        id: `${column}-${row}`,
        checked: false,
        border: "allBorders"
      }
      this.treadlingBoxes.push(x);
      if (column + 1 > this.patternLength) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
    this.treadlingBoxesEvent.emit(this.treadlingBoxes);
  }

}
