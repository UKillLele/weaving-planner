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
  startSelect: string = "";
  selectedGroup: Box[] = [];
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
        color: ""
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

  startSelecting(boxId: string) {
    this.startSelect = boxId;
  }

  stopSelecting(event: MouseEvent, boxId: string) {
    if (boxId === this.startSelect) {
      this.startSelect = "";
      this.threadingBoxes.map(x => x.color = 'transparent');
    }
    else {
      const x1 = Number(this.startSelect.substring(0, this.startSelect.indexOf("-")));
      const x2 = Number(boxId.substring(0, boxId.indexOf("-")));
      this.selectedGroup = this.threadingBoxes.filter(box => {
        const currentX = Number(box.id.substring(0, box.id.indexOf("-")));
        if ((currentX >= x1 && currentX <= x2) || ( currentX >= x2 && currentX <= x1))  {
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
    this.cancel();
  }

  cancel() {
    this.startSelect = "";
    this.selectedGroup = new Array();
    this.threadingBoxes.map(x => x.color = 'transparent');
  }
}
