import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-color-planner',
  templateUrl: './color-planner.component.html',
  styleUrls: ['./color-planner.component.scss']
})
export class ColorPlannerComponent implements OnInit, OnChanges {
  colorBoxes?: Box[][];
  selectedBoxGroup: Box[] = [];
  @Input() direction: string = "";
  @Input() boxCount: number = 0;
  colorChoices: string[] = [
    "red",
    "green",
    "blue"
  ]

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => this.colorBoxes = colorBoxes);
    this.updateBoxes();
  }

  ngOnChanges():void {
    this.updateBoxes();
  }

  updateBoxes() {
    if (this.colorBoxes == undefined) {
      this.colorBoxes = new Array<Box[]>(2);
    }
    this.selectedBoxGroup = this.colorBoxes[this.direction == "vertical" ? 1 : 0];
    if (this.selectedBoxGroup == undefined) {
      this.selectedBoxGroup = new Array<Box>(this.boxCount);
    }
    for (let i = 1; i <= this.boxCount; i++) {
      if (this.selectedBoxGroup[i] == null || this.selectedBoxGroup[i] == undefined) {
        const column = this.direction == "vertical" ? 0 : i;
        const row = this.direction == "vertical" ? i : 0;
        let x: Box = {
          id: `${column}-${row}`,
          selected: false,
          border: "allBorders",
          color: "transparent"
        }
        this.selectedBoxGroup[i - 1] = x;
      }
    }
    this.colorBoxes[this.direction == "vertical" ? 1 : 0] = this.selectedBoxGroup;
    this.weavingService.changeColorBoxes(this.colorBoxes);
  }

  boxesChanged() {
    if (this.colorBoxes != undefined) this.weavingService.changeColorBoxes(this.colorBoxes);
  }
}
