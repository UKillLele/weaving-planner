import { Component } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weaving-planner';
  shafts: number = 0;
  treadles: number = 0;
  trompAsWrit: boolean = false;
  epi: number = 0;
  workingWidth: number = 0;
  warp: number = 0;
  patternLength: number = 0;
  tieUpBoxes: box[] = [];
  threadingBoxes: box[] = [];
  treadlingBoxes: box[] = [];
  leftCol: number = 0;;
  rightCol: number = 0;;
  internalWidth: number = 0;;

  updateShafts(shafts: number) {
    this.shafts = shafts;
  }
  updateTreadles(treadles: number) {
    this.treadles = treadles;
    this.leftCol = (64 / (64 + this.treadles)) * 100;
    this.rightCol = (this.treadles / (64 + this.treadles)) * 100;
  }
  updateTromp(trompAsWrit: boolean) {
    this.trompAsWrit = trompAsWrit;
  }
  updatePatternLength(patternLength: number) {
    this.patternLength = patternLength;
  }
  updateTieUpBoxes(boxes: box[]) {
    this.tieUpBoxes = boxes;
  }
  updateThreadingBoxes(boxes: box[]) {
    this.threadingBoxes = boxes;
  }
  updateTreadlingBoxes(boxes: box[]) {
    this.treadlingBoxes = boxes;
  }
  updateEpi(epi: number) {
    this.epi = epi;
    this.warp = this.epi * this.workingWidth;
    this.getWarp();
  }
  updateWorkingWidth(workingWidth: number) {
    this.workingWidth = workingWidth;
    this.getWarp();
  }

  getWarp() {
    if (this.epi != 0 && this.workingWidth != 0) {
      this.warp = this.epi * this.workingWidth;
      this.internalWidth = (((this.rightCol/this.treadles) * this.warp)/this.leftCol) * 100;
    }
  }
}