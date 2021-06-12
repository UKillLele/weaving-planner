import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-tie-up-planner',
  templateUrl: './tie-up-planner.component.html',
  styleUrls: ['./tie-up-planner.component.scss']
})
export class TieUpPlannerComponent implements OnInit, OnChanges {

  @Input() shafts: number = 0;
  @Input() treadles: number = 0;
  @Output() boxesEvent = new EventEmitter<box[]>();
  boxes: box[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.boxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.treadles;
    for (let i = 1; i <= cells; i++) {
      let x: box = {
        id: `${column}-${row}`,
        checked: false
      }
      this.boxes.push(x);
      if (column + 1 > this.treadles) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
    this.boxesEvent.emit(this.boxes);
  }

}
