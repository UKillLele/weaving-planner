import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-treadling-planner',
  templateUrl: './treadling-planner.component.html',
  styleUrls: ['./treadling-planner.component.scss']
})
export class TreadlingPlannerComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger!: ElementRef;

  treadles: number = 0;
  patternLength: number = 0;
  treadlingBoxes: Box[] = [];
  width: number = 0;
  boxWidth: number = 0;
  startSelect: number | null = null;
  endSelect: number | null = null;
  secondSelection: boolean = false;
  startSecondSelect: number | null = null;
  multiSelect: number[][] = [];
  menuTopLeftPosition =  {x: '0', y: '0'};
  mouseDown: boolean = false;

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Control" && this.multiSelect.length > 0 && !this.mouseDown) {
      this.repeat();
    }
  }

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => {
      if(treadlingBoxes?.length > 0 && treadlingBoxes != this.treadlingBoxes) {
        this.treadlingBoxes = treadlingBoxes
      }
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.treadles = treadles;
      this.updateTreadling();
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternLength = patternLength;
      this.updateTreadling();
    });
    
    this.weavingService.boxWidth.subscribe((boxWidth: number) => { 
      this.boxWidth = boxWidth;
      this.setWidths();
    });
  }

  setWidths() {
    this.width = this.boxWidth * this.treadles;
  }

  updateTreadling() {
    this.setWidths();
    const existingBoxes = this.treadlingBoxes;
    let newBoxes = [];
    for (let row = 1; row <= this.patternLength; row++) {
      for (let column = 1; column <= this.treadles; column ++) {
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
    this.weavingService.changeTreadlingBoxes(newBoxes);
  }

  boxesChanged(i: number) {
    this.clearSelections();
    this.treadlingBoxes[i].selected = !this.treadlingBoxes[i].selected;
    this.weavingService.changeTreadlingBoxes(this.treadlingBoxes);
  }

  clearSelections() {
    this.mouseDown = false;
    this.startSelect = null;
    this.startSecondSelect = null;
    this.endSelect = null;
    this.secondSelection = false;
    this.multiSelect = [];
  }

  startSelecting(y: number) {
    this.mouseDown = true;
    if (!this.secondSelection) {
      this.startSelect = y;
      this.endSelect = null;
    } else {
      this.startSecondSelect = y;
    }
  }

  onDrag(y: number) {
    if (this.mouseDown) {
      if (this.startSelect && !this.endSelect && !this.startSecondSelect) {
        this.treadlingBoxes.map(box => {
          box.color = this.isBoxInside(this.startSelect, box.y, y) ? 'select' : '';
        });
      } else if (this.startSecondSelect) {
        this.treadlingBoxes.map(box => {
          if (this.isBoxInside(this.startSelect, box.y, this.endSelect)) box.color = 'select'
          else {
            let inMulti = false;
            if (this.isBoxInside(this.startSecondSelect, box.y, y)) {
              box.color = 'multiselect';
              inMulti = true;
            }
            this.multiSelect?.forEach(select => {
              if (this.isBoxInside(select[0], box.y, select[1])) {
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

  stopSelecting(event: MouseEvent, y: number) {
    this.mouseDown = false;
    if (!this.secondSelection) {
      this.endSelect = y;
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
        if (y === this.startSecondSelect) return;
        // if start or end is in multi, remove original
        if (this.multiSelect.length > 0) {
          this.multiSelect.forEach(section => {
            if ((this.startSecondSelect! < section[0] && this.startSecondSelect! > section[1]) ||
              (this.startSecondSelect! > section[0] && this.startSecondSelect! < section[1]) ||
              (y < section[0] && y > section[1]) ||
              (y > section[0] && y < section[1])
            ) {
              this.multiSelect.splice(this.multiSelect.indexOf(section))
            }
          })
        }
      } 

      const newArea = [this.startSecondSelect!, y];
      if (this.multiSelect.length == 0) this.multiSelect = [newArea];
      else this.multiSelect.push(newArea);

      if (!event.ctrlKey) {
        if (y === this.startSecondSelect) {
          this.cancel();
        } else {
          this.repeat();
        }
      }
      this.startSecondSelect = null;
    }
  }

  isBoxInside(minY: number | null, currentY: number, maxY: number | null) {
    return (minY && maxY &&
          (
            (currentY >= minY && currentY <= maxY) || 
            (currentY >= maxY && currentY <= minY)
          )
    )
  }

  repeat() {
    let repeatArea = new Array();
    if (this.secondSelection) {
      this.multiSelect.forEach(select => {
        repeatArea = this.treadlingBoxes.filter(y => this.isBoxInside(select[0], y.y, select[1]));
        this.checkBoxes(repeatArea);
      })
    } else {
      repeatArea = this.treadlingBoxes;
      this.checkBoxes(repeatArea);
    }
      this.cancel();
  }

  checkBoxes(repeatArea: Box[]) {
    if (this.startSelect && this.endSelect) {
      const model = this.treadlingBoxes.filter(el => this.isBoxInside(this.startSelect, el.y, this.endSelect));
      const modelRowCount = model?.filter(x => x.x === 1)?.length;
      let row = 0;
      repeatArea.forEach((box) => {
        if (box.x === 1) row ++;
        if (row > modelRowCount) row = 1;
        let modelRow = 0;
        let mBox = new Box();
        model.forEach(m => {
          if (m.x === 1) modelRow ++;
          if (row % modelRow === 0 && m.x === box.x) mBox = m;
        });
        if (mBox.x > -1) {
          box.selected = mBox.selected;
        }
      });
      this.weavingService.changeTreadlingBoxes(this.treadlingBoxes);
    }
  }

  repeatOverSelection() {
    this.secondSelection = true;
  }

  cancel() {
    this.clearSelections();
    this.treadlingBoxes.map(x => x.color = 'transparent');
  }

}
