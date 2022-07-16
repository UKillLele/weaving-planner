import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-threading-planner',
  templateUrl: './threading-planner.component.html',
  styleUrls: ['./threading-planner.component.scss']
})
export class ThreadingPlannerComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger!: ElementRef;

  shafts: number = 0;
  patternWidth: number = 0;
  internalWidth: number = 0;
  threadingBoxes: Box[] = [];
  startSelect: number | null = null;
  endSelect: number | null = null;
  secondSelection: boolean = false;
  startSecondSelect: number | null = null;
  multiSelect: number[][] = [];
  menuTopLeftPosition =  {x: '0', y: '0'};
  mouseDown: boolean = false;
  boxWidth: number = 0;

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Control" && this.multiSelect.length > 0 && !this.mouseDown) {
      this.repeat();
    }
  }

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => {
      if(threadingBoxes?.length > 0 && threadingBoxes != this.threadingBoxes) {
        this.threadingBoxes = threadingBoxes
      }
    });
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.shafts = shafts ?? 0;
      if (this.threadingBoxes?.length > 0) {
        this.updateThreading();
      }
    });
    this.weavingService.patternWidth.subscribe((patternWidth: number) => {
      this.patternWidth = patternWidth ?? 0;
      if (this.threadingBoxes?.length > 0) {
        this.updateThreading();
      }
    });
    this.weavingService.boxWidth.subscribe((boxWidth: number) => { 
      this.boxWidth = boxWidth;
    });
    this.weavingService.internalWidth.subscribe((internalWidth: number) => this.internalWidth = internalWidth);
  }

  updateThreading() {
    const existingBoxes = this.threadingBoxes;
    let newBoxes = [];
    for (let row = 1; row <= this.shafts; row++) {
      for (let column = 1; column <= this.patternWidth; column ++) {
        const id = `${column}-${row}`;
        let box: Box = existingBoxes?.find(y => y.id === id) ?? {
          id: `${column}-${row}`,
          selected: false,
          border: "allBorders",
          color: "",
          x: column,
          y: row
        }
        newBoxes.push(box);
      }
    }
    this.weavingService.changeThreadingBoxes(newBoxes);
  }

  boxesChanged(i: number) {
    this.clearSelections();
    this.threadingBoxes[i].selected = !this.threadingBoxes[i].selected;
    this.weavingService.changeThreadingBoxes(this.threadingBoxes);
  }

  clearSelections() {
    this.mouseDown = false;
    this.startSelect = null;
    this.startSecondSelect = null;
    this.endSelect = null;
    this.secondSelection = false;
    this.multiSelect = [];
  }

  startSelecting(x: number) {
    this.mouseDown = true;
    if (!this.secondSelection) {
      this.startSelect = x;
      this.endSelect = null;
    } else {
      this.startSecondSelect = x;
    }
  }

  onDrag(x: number) {
    if (this.mouseDown) {
      if (this.startSelect && !this.endSelect && !this.startSecondSelect) {
        this.threadingBoxes.map(box => {
          box.color = this.isBoxInside(this.startSelect, box.x, x) ? 'select' : '';
        });
      } else if (this.startSecondSelect) {
        this.threadingBoxes.map(box => {
          if (this.isBoxInside(this.startSelect, box.x, this.endSelect)) box.color = 'select'
          else {
            let inMulti = false;
            if (this.isBoxInside(this.startSecondSelect, box.x, x)) {
              box.color = 'multiselect';
              inMulti = true;
            }
            this.multiSelect?.forEach(select => {
              if (this.isBoxInside(select[0], box.x, select[1])) {
                box.color = 'multiselect';
                inMulti = true;
              }
            });
            if (!inMulti) box.color = '';
          }
        });
      }
    }
  }

  stopSelecting(event: MouseEvent, x: number) {
    this.mouseDown = false;
    if (!this.secondSelection) {
      this.endSelect = x;
      if (this.endSelect === this.startSelect) {
        this.cancel();
      }
      else {
        this.menuTopLeftPosition.x = event.clientX + 'px'; 
        this.menuTopLeftPosition.y = event.clientY + 'px'; 
        this.menuTrigger.nativeElement.click(); 
      }
    } else {
      if (event.ctrlKey) {
        // if start end and are the same, do nothing
        if (x === this.startSecondSelect) return;
        // if start or end is in multi, remove original
        if (this.multiSelect.length > 0) {
          this.multiSelect.forEach(section => {
            if ((this.startSecondSelect! < section[0] && this.startSecondSelect! > section[1]) ||
              (this.startSecondSelect! > section[0] && this.startSecondSelect! < section[1]) ||
              (x < section[0] && x > section[1]) ||
              (x > section[0] && x < section[1])
            ) {
              this.multiSelect.splice(this.multiSelect.indexOf(section))
            }
          })
        }
      } 

      const newArea = [this.startSecondSelect!, x];
      if (this.multiSelect.length == 0) this.multiSelect = [newArea];
      else this.multiSelect.push(newArea);

      if ((!event.ctrlKey)) {
        if (x === this.startSecondSelect) {
          this.cancel();
        } else {
          this.repeat();
        }
      }
      this.startSecondSelect = null;
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
    let repeatArea = new Array();
    if (this.secondSelection) {
      this.multiSelect.forEach(select => {
        repeatArea = this.threadingBoxes.filter(x => this.isBoxInside(select[0], x.x, select[1]));
        this.checkBoxes(repeatArea);
      })
    } else {
      repeatArea = this.threadingBoxes;
      this.checkBoxes(repeatArea);
    }
      this.cancel();
  }

  checkBoxes(repeatArea: Box[]) {
    if (this.startSelect && this.endSelect) {
      const model = this.threadingBoxes.filter(el => this.isBoxInside(this.startSelect, el.x, this.endSelect));
      const columns = Math.abs(this.endSelect - this.startSelect) + 1;
      let row = 1;
      let column = 0;
      repeatArea.forEach((box) => {
        if (box.y !== row) {
          row ++;
          column = 0;
        }
        const modelColumn = column % columns;
        const mBox = model.find((m, i) => Math.floor(i % columns)  === modelColumn && m.y === box.y);
        if (mBox) {
          box.selected = mBox.selected;
        }
        column ++;
      });
      this.weavingService.changeThreadingBoxes(this.threadingBoxes);
    }
  }

  repeatOverSelection() {
    this.secondSelection = true;
  }

  cancel() {
    this.clearSelections();
    this.threadingBoxes.map(x => x.color = 'transparent');
  }
}
