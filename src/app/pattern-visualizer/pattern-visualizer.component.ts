import { Component, OnInit } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-pattern-visualizer',
  templateUrl: './pattern-visualizer.component.html',
  styleUrls: ['./pattern-visualizer.component.scss']
})
export class PatternVisualizerComponent implements OnInit {
  patternLength: number = 0;
  patternWidth: number = 0;
  internalWidth: number = 0;
  tieUpBoxes: Box[] = [];
  threadingBoxes: Box[] = [];
  treadlingBoxes: Box[] = [];
  visualizerBoxes: Box[] = [];
  colorBoxes: Box[][] = [];
  boxWidth: number = 0;

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    let initialLoad = true;
    this.weavingService.patternWidth.subscribe((patternWidth: number) => {
      this.patternWidth = patternWidth;
      if (!initialLoad) {
        console.log("width");
        this.updateVisualizerBoxes();
      }
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternLength = patternLength;
      if (!initialLoad) {
        console.log("length");
        this.updateVisualizerBoxes();
      }
    });
    this.weavingService.internalWidth.subscribe((internalWidth: number) => { this.internalWidth = internalWidth });
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => { 
      this.colorBoxes = colorBoxes;
      if (!initialLoad) {
        console.log("colors");
        this.updateVisualizerSelections();
      }
    });
    this.weavingService.tieUpBoxes.subscribe((tieUpBoxes: Box[]) => {
      this.tieUpBoxes = tieUpBoxes;
      if (!initialLoad) {
        console.log("tie up");
        this.updateVisualizerSelections();
      }
    });
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => {
      this.threadingBoxes = threadingBoxes;
      if (!initialLoad) {
        console.log("threading");
        this.updateVisualizerSelections();
      }
    });
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => {
      this.treadlingBoxes = treadlingBoxes;
      if (!initialLoad) {
        console.log("treadling");
        this.updateVisualizerSelections();
      }
    });
    this.weavingService.boxWidth.subscribe((boxWidth: number) => { 
      this.boxWidth = boxWidth;
    });
    initialLoad = false;
  }

  updateVisualizerBoxes() {
    this.visualizerBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.patternLength * this.patternWidth;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "weftBorder",
        color: "",
        x: column,
        y: row
      }
      this.visualizerBoxes.push(x);
      if (column + 1 > this.patternWidth) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
  }

  updateVisualizerSelections() {
    setTimeout(() => {
      if (this.visualizerBoxes.length > 0) {
        this.visualizerBoxes.forEach(box =>{
          var warp = box.x;
          var weft = box.y;
          var selectedThreadings = this.threadingBoxes?.filter(x => x.x == warp && x.selected).map(x => x.y);
          var selectedTreadles = this.treadlingBoxes?.filter(x => x.y == weft && x.selected).map(x => x.x);
          var ids = new Array();
          if (selectedTreadles && selectedTreadles.length > 0 && selectedThreadings && selectedThreadings.length > 0) {
            selectedThreadings.forEach(threading => {
              selectedTreadles.forEach(treadle => {
                ids.push(`${treadle}-${threading}`);
              });
            });
            if (this.tieUpBoxes?.find((x: Box) => ids.includes(x.id) && x.selected) != null)
            {
              var c = this.colorBoxes[0][warp - 1]?.color;
              box.color = c ? c : "";
              box.border = "warpBorder"
            } else {
              var c = this.colorBoxes[1][weft - 1]?.color;
              box.color = c ? c : "";
              box.border = "weftBorder"
            }
          }
        });
      }
    }, 5);
  }
}
