import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-threading-planner',
  templateUrl: './threading-planner.component.html',
  styleUrls: ['./threading-planner.component.scss']
})
export class ThreadingPlannerComponent implements OnInit, OnChanges {
  @Input() shafts: number = 0;
  @Input() patternWidth: number = 0;
  threadingBoxes: box[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.threadingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.patternWidth;
    for (let i = 1; i <= cells; i++) {
      let x: box = {
        id: `${column}-${row}`,
        checked: false
      }
      this.threadingBoxes.push(x);
      if (column + 1 > this.patternWidth) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
  }

}
