import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-threading-planner',
  templateUrl: './threading-planner.component.html',
  styleUrls: ['./threading-planner.component.scss']
})
export class ThreadingPlannerComponent implements OnInit, OnChanges {
  @Input() shafts: number = 0;
  @Input() warp: number = 0;
  @Input() width: number = 0;
  @Output() threadingBoxesEvent = new EventEmitter<box[]>();
  threadingBoxes: box[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.threadingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.warp;
    for (let i = 1; i <= cells; i++) {
      let x: box = {
        id: `${column}-${row}`,
        selected: false,
        border: "allBorders"
      }
      this.threadingBoxes.push(x);
      if (column + 1 > this.warp) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
    this.threadingBoxesEvent.emit(this.threadingBoxes);
  }

}
