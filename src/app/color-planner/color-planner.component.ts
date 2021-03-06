import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-color-planner',
  templateUrl: './color-planner.component.html',
  styleUrls: ['./color-planner.component.scss']
})
export class ColorPlannerComponent implements OnInit, OnChanges {
  colorBoxes!: Box[][];
  selectedBoxGroup: Box[] = [];
  @Input() direction: string = "";
  @Input() boxCount: number = 0;
  selectedColor: string = "";
  selectedBoxes: Box[] = [];
  lastBoxIndex: number = -1;
  trompAsWrit: boolean = false;
  boxWidth: number = 0;

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => {
      this.colorBoxes = colorBoxes;
    });
    this.weavingService.selectedColor.subscribe((selectedColor: string) => {
      this.selectedColor = selectedColor;
    });
    this.weavingService.trompAsWrit.subscribe((trompAsWrit: boolean) => {
      this.trompAsWrit = trompAsWrit;
    });
    this.weavingService.boxWidth.subscribe((boxWidth: number) => { 
      this.boxWidth = boxWidth;
    });
  }

  ngOnChanges(): void {
    this.updateBoxes();
  }

  selectBox(boxId: string | undefined, mouse: string) {
    // ignore hovers when not clicked
    if ((this.lastBoxIndex > -1 && mouse === "over") || mouse !== "over") {
      if (boxId && !(this.trompAsWrit && this.direction === "vertical")) {
        const box = this.selectedBoxGroup?.find(x => x.id == boxId);
        if (box) {
          if (this.lastBoxIndex > -1 && mouse === "over") {
            box.color = this.selectedColor;
            if (this.trompAsWrit) {
              this.colorBoxes![1].find(b => b.y === box.x && b.x === box.y)!.color = this.selectedColor;
            }
          } else if (mouse === "down") {
            box.color = this.selectedColor;
            this.lastBoxIndex = this.selectedBoxGroup.indexOf(box);
            if (this.trompAsWrit) {
              this.colorBoxes![1].find(b => b.y === box.x && b.x === box.y)!.color = this.selectedColor;
            }
          } else {
            this.lastBoxIndex = -1;
          }
          this.boxesChanged();
        }
      }
    }
  }

  updateBoxes() {
    if (this.boxCount > 0) {
      this.selectedBoxGroup = [];
      if (!this.colorBoxes) this.colorBoxes = new Array<Box[]>(2);
      this.selectedBoxGroup = this.colorBoxes[this.direction == "vertical" ? 1 : 0] ?? [];
      if (this.selectedBoxGroup == undefined || this.boxCount > this.selectedBoxGroup.length) {
        let count = this.selectedBoxGroup?.length > 0 ? this.boxCount - this.selectedBoxGroup.length : 0;
        for (let i = count; i <= this.boxCount; i++) {
          if (this.selectedBoxGroup[i] == null || this.selectedBoxGroup[i] == undefined) {
            const column = this.direction == "vertical" ? 0 : i + 1;
            const row = this.direction == "vertical" ? i + 1 : 0;
            let x: Box = {
              id: `${column}-${row}`,
              selected: false,
              border: "allBorders",
              color: "transparent",
              x: column,
              y: row
            }
            this.selectedBoxGroup[i] = x;
          }
        }
      }
      if (this.selectedBoxGroup.length > this.boxCount) this.selectedBoxGroup = this.selectedBoxGroup.slice(0, this.boxCount);
      this.colorBoxes[this.direction == "vertical" ? 1 : 0] = this.selectedBoxGroup;
      this.boxesChanged();
    }
  }

  boxesChanged() {
    if (this.colorBoxes != undefined) this.weavingService.changeColorBoxes(this.colorBoxes);
  }
}
