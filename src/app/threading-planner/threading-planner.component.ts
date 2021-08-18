import { Component, OnInit } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-threading-planner',
  templateUrl: './threading-planner.component.html',
  styleUrls: ['./threading-planner.component.scss']
})
export class ThreadingPlannerComponent implements OnInit {
  shafts: number = 0;
  warp: number = 0;
  internalWidth: number = 0;
  threadingBoxes: Box[] = [];

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => this.threadingBoxes = threadingBoxes);
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.shafts = shafts;
      this.updateThreading();
    });
    this.weavingService.warp.subscribe((warp: number) => {
      this.warp = warp;
      this.updateThreading();
    });
    this.weavingService.internalWidth.subscribe((internalWidth: number) => this.internalWidth = internalWidth);
  }

  updateThreading() {
    this.threadingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.warp;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "allBorders",
        color: ""
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
    this.weavingService.changeThreadingBoxes(this.threadingBoxes);
  }

}
