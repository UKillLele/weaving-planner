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
  secondSelection: boolean = false;
  startSecondSelect: number | null = null;
  endSecondSelect: number | null = null;
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
    if (!this.secondSelection) {
      this.startSelect = x;
      this.endSelect = null;
    } else {
      this.startSecondSelect = x;
      this.endSecondSelect = null;
    }
  }

  onDrag(x: number) {
    if (this.startSelect && !this.endSelect && !this.startSecondSelect) {
      this.threadingBoxes.filter(box => {
        box.color = this.isBoxInside(this.startSelect, box.x, x) ? 'yellow' : 'transparent';
      });
    } else if (this.startSecondSelect && !this.endSecondSelect) {
      this.threadingBoxes.filter(box => {
        if (this.isBoxInside(this.startSelect, box.x, this.endSelect)) box.color = 'yellow'
        else if (this.isBoxInside(this.startSecondSelect, box.x, x)) box.color = 'orange';
        else box.color = 'transparent';
      });
    }
  }

  stopSelecting(event: MouseEvent, y: number) {
    if (!this.secondSelection) {
      this.endSelect = y;
      if (this.endSelect === this.startSelect) {
        this.cancel();
      }
      else {
        this.menuTopLeftPosition.x = event.clientX + 'px'; 
        this.menuTopLeftPosition.y = event.clientY + 'px'; 
        this.matMenuTrigger.openMenu(); 
      }
    } else {
      this.endSecondSelect = y;
      if (this.endSecondSelect === this.startSecondSelect) {
        this.cancel();
      } else {
        this.repeat();
      }
    }
  }

  isBoxInside(minX: number | null, currentX: number, maxX: number | null) {
    return (minX && maxX &&
          (
            (currentX >= minX && currentX <= maxX) || 
            (currentX >= maxX && currentX <= minX)
          )
    )
  }

  repeat() {
    if (this.startSelect && this.endSelect) {
      const model = this.threadingBoxes.filter(el => this.isBoxInside(this.startSelect, el.x, this.endSelect));
      let repeatArea = this.secondSelection ? this.threadingBoxes.filter(x => this.isBoxInside(this.startSecondSelect, x.x, this.endSecondSelect)) : this.threadingBoxes;
      const columns = Math.abs(this.endSelect - this.startSelect) + 1;
      let row = 1;
      let column = 0;
      repeatArea.forEach((box, index) => {
        if (box.y !== row) {
          row ++;
          column = 0;
        }
        const modelColumn = column % columns;
        const modelBoxesInRow = model.filter((m, i) => Math.floor(i % columns)  === modelColumn);
        const mBox = model.find((m, i) => Math.floor(i % columns)  === modelColumn && m.y === box.y);
        if (mBox) {
          box.selected = mBox.selected;
        }
        column ++;
      });
      this.cancel();
    }
  }

  repeatOverSelection() {
    this.secondSelection = true;
  }

  cancel() {
    this.startSelect = null;
    this.endSelect = null;
    this.startSecondSelect = null;
    this.endSecondSelect = null;
    this.secondSelection = false;
    this.threadingBoxes.map(x => x.color = 'transparent');
  }
}
