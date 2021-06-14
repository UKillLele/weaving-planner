import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { box } from 'src/models/box';

@Component({
  selector: 'app-pattern-visualizer',
  templateUrl: './pattern-visualizer.component.html',
  styleUrls: ['./pattern-visualizer.component.scss']
})
export class PatternVisualizerComponent implements OnInit, OnChanges {
  @Input() patternLength: number = 0;
  @Input() warp: number = 0;
  @Input() width: number = 0;
  @Input() tieUpBoxes: box[] = [];
  @Input() threadingBoxes: box[] = [];
  @Input() treadlingBoxes: box[] = [];
  visualizerBoxes: box[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.visualizerBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.patternLength * this.warp;
    for (let i = 1; i <= cells; i++) {
      let x: box = {
        id: `${column}-${row}`,
        checked: false,
        border: "noBorders"
      }
      this.visualizerBoxes.push(x);
      if (column + 1 > this.warp) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
    this.visualizerBoxes.forEach(box => {
      const threadingPosition = box.id.substring(0, box.id.indexOf("-"));
      const treadlingPosition = box.id.substring(box.id.indexOf("-") + 1);
      //console.log(`${threadingPosition}, ${treadlingPosition}`)
      const threadingBox = this.threadingBoxes.find(x => x.id.substring(0, x.id.indexOf("-")) == threadingPosition && x.checked);
      let treadlingBoxes = this.treadlingBoxes.filter(x => x.id.substring(x.id.indexOf("-") + 1) == treadlingPosition);
      //treadlingBoxes = treadlingBoxes.filter(x => x.checked == true);
      const treadlingBox = treadlingBoxes.find(x => x.checked);
      if (treadlingBoxes.length > 0) {
        console.log(box.id);
        console.log(`${threadingPosition}, ${treadlingPosition}`)
        console.log(treadlingBoxes)
        console.log(treadlingBox);
      }
      if (threadingBox != null && treadlingBox !=null) {
        console.log('got here');
        const tieUpY = threadingBox.id.substring(0, threadingBox.id.indexOf("-"));
        const tieUpX = treadlingBox.id.substring(treadlingBox.id.indexOf("-") + 1);
        const tieUpBox = this.tieUpBoxes.find(x => x.id == `${tieUpX}-${tieUpY}`);
        box.border = tieUpBox?.checked ? 'warpBorder' : 'weftBorder';
      }
    })
  }

}
