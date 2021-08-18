import { Component, OnInit } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-tie-up-planner',
  templateUrl: './tie-up-planner.component.html',
  styleUrls: ['./tie-up-planner.component.scss']
})
export class TieUpPlannerComponent implements OnInit {

  shafts: number = 0;
  treadles: number = 0;
  tieUpBoxes: Box[] = [];
  boxWidth: number = 0;
  margin: number = 0;

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.shafts = shafts;
      this.updateTieUp();
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.treadles = treadles;
      this.updateTieUp();
    });
    this.weavingService.boxWidth.subscribe((boxWidth: number) => { 
      this.margin = boxWidth;
      this.updateTieUp();
    });
    this.weavingService.tieUpBoxes.subscribe((tieUpBoxes: Box[]) => this.tieUpBoxes = tieUpBoxes);
  }

  updateTieUp() {
    this.tieUpBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.treadles;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "allBorders",
        color: ""
      }
      this.tieUpBoxes.push(x);
      if (column + 1 > this.treadles) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  boxesChanged() {
    this.weavingService.changeTieUpBoxes(this.tieUpBoxes);
  }

}
