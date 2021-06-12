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
  patternWidth: number = 0;
  patternLength: number = 0;
  tieUpBoxes: box[] = [];
  leftCol: string = "";
  rightCol: string = "";

  updateShafts(shafts: number) {
    this.shafts = shafts;
  }
  updateTreadles(treadles: number) {
    this.treadles = treadles;
    this.getWidth();
  }
  updateTromp(trompAsWrit: boolean) {
    this.trompAsWrit = trompAsWrit;
  }
  updatePatternWidth(patternWidth: number) {
    this.patternWidth = patternWidth;
    this.getWidth();
  }
  updatePatternLength(patternLength: number) {
    this.patternLength = patternLength;
  }
  updateBoxes(boxes: box[]) {
    this.tieUpBoxes = boxes;
  }

  getWidth() {
    if (this.patternWidth > 0 && this.treadles > 0) {
      this.leftCol = `${(this.patternWidth / (this.patternWidth + this.treadles)) * 100}%`;
      this.rightCol = `${(this.treadles / (this.patternWidth + this.treadles)) * 100}%`;
    }
  }
}