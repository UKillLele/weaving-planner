import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-threading-planner',
  templateUrl: './threading-planner.component.html',
  styleUrls: ['./threading-planner.component.scss']
})
export class ThreadingPlannerComponent implements OnInit {
  shafts: number = 0;
  patternWidth: number = 0;
  internalWidth: number = 0;
  threadingBoxes: Box[] = [];
  startSelect: number | null = null;
  endSelect: number | null = null;
  menuTopLeftPosition =  {x: '0', y: '0'} 
  
  @ViewChild('matMenuTrigger') matMenuTrigger!: MatMenuTrigger; 

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => this.threadingBoxes = threadingBoxes);
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.shafts = shafts;
      this.updateThreading();
    });
    this.weavingService.patternWidth.subscribe((patternWidth: number) => {
      this.patternWidth = patternWidth;
      this.updateThreading();
    });
    this.weavingService.internalWidth.subscribe((internalWidth: number) => this.internalWidth = internalWidth);
  }

  updateThreading() {
    this.threadingBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.shafts * this.patternWidth;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "allBorders",
        color: "",
        x: column,
        y: row
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
    this.weavingService.changeThreadingBoxes(this.threadingBoxes);
  }

  startSelecting(x: number) {
    this.startSelect = x;
  }

  stopSelecting(event: MouseEvent, y: number) {
    this.endSelect = y;
    if (this.endSelect === this.startSelect) {
      this.startSelect = null;
      this.endSelect = null;
      this.threadingBoxes.map(x => x.color = 'transparent');
    }
    else {
      this.threadingBoxes.filter(box => {
        const currentX = box.x;
        if (
          (this.startSelect && this.endSelect) && 
          (
            (currentX >= this.startSelect && currentX <= this.endSelect) || 
            (currentX >= this.endSelect && currentX <= this.startSelect)
          )
        )  {
          box.color = 'yellow';
        }
        else box.color = 'transparent';
      });
      this.menuTopLeftPosition.x = event.clientX + 'px'; 
      this.menuTopLeftPosition.y = event.clientY + 'px'; 
      this.matMenuTrigger.openMenu(); 
    }
  }

  repeat() {
    // WIP
    const model = this.threadingBoxes.filter(x => x.x);

    this.cancel();
  }

  cancel() {
    this.startSelect = null;
    this.endSelect = null;
    this.threadingBoxes.map(x => x.color = 'transparent');
  }
}
