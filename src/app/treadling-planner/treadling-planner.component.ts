import { Component, OnInit } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-treadling-planner',
  templateUrl: './treadling-planner.component.html',
  styleUrls: ['./treadling-planner.component.scss']
})
export class TreadlingPlannerComponent implements OnInit {

  treadles: number = 0;
  patternLength: number = 0;
  treadlingBoxes: Box[] = [];

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternLength = patternLength;
      this.updateTreadling();
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.treadles = treadles;
      this.updateTreadling();
    });
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => this.treadlingBoxes = treadlingBoxes);
  }

  updateTreadling() {
    this.treadlingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.treadles * this.patternLength;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "allBorders"
      }
      this.treadlingBoxes.push(x);
      if (column + 1 > this.treadles) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
    this.weavingService.changeTreadlingBoxes(this.treadlingBoxes);
  }

}
