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
  warp: number = 0;
  internalWidth: number = 0;
  tieUpBoxes: Box[] = [];
  threadingBoxes: Box[] = [];
  treadlingBoxes: Box[] = [];
  visualizerBoxes: Box[] = [];
  colorBoxes: Box[][] = [];

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.warp.subscribe((warp: number) => {
      this.warp = warp;
      this.updateVisualizerBoxes();
    });
    this.weavingService.internalWidth.subscribe((internalWidth: number) => { this.internalWidth = internalWidth });
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => { 
      this.colorBoxes = colorBoxes;
      this.updateVisualizerBoxes();
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternLength = patternLength;
      this.updateVisualizerBoxes();
    });
    this.weavingService.tieUpBoxes.subscribe((tieUpBoxes: Box[]) => {
      this.tieUpBoxes = tieUpBoxes;
      this.updateVisualizerSelections();
    });
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => {
      this.threadingBoxes = threadingBoxes;
      this.updateVisualizerSelections();
    });
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => {
      this.treadlingBoxes = treadlingBoxes;
      this.updateVisualizerSelections();
    });
    this.weavingService.visualizerBoxes.subscribe((visualizerBoxes: Box[]) => {
      this.visualizerBoxes = visualizerBoxes;
      this.updateVisualizerSelections();
    });

  }

  updateVisualizerBoxes() {
    this.visualizerBoxes = [];
    let row: number = 1;
    let column: number = 1;
    const cells = this.patternLength * this.warp;
    for (let i = 1; i <= cells; i++) {
      let x: Box = {
        id: `${column}-${row}`,
        selected: false,
        border: "weftBorder",
        color: ""
      }
      this.visualizerBoxes.push(x);
      if (column + 1 > this.warp) {
        column = 1;
        row ++;
      } else {
        column ++;
      }
    }
    this.weavingService.changeVisualizerBoxes(this.visualizerBoxes);
  }

  updateVisualizerSelections() {
    setTimeout(() => {
      if (this.visualizerBoxes.length > 0) {
        this.visualizerBoxes.forEach(box =>{
          var warp = box.id.substring(0, box.id.indexOf("-"));
          var weft = box.id.substring(box.id.indexOf("-") + 1);
          var selectedThreadings = this.threadingBoxes?.filter(x => x.id.substring(0, x.id.indexOf("-")) == warp && x.selected).map(x => x.id.substring(x.id.indexOf("-") + 1));
          var selectedTreadles = this.treadlingBoxes?.filter(x => x.id.substring(x.id.indexOf("-") + 1) == weft && x.selected).map(x => x.id.substring(0, x.id.indexOf("-")));
          var ids = new Array();
          if (selectedTreadles && selectedTreadles.length > 0 && selectedThreadings && selectedThreadings.length > 0) {
            selectedThreadings.forEach(threading => {
              selectedTreadles.forEach(treadle => {
                ids.push(`${treadle}-${threading}`);
              });
            });
            if (this.tieUpBoxes?.find((x: Box) => ids.includes(x.id) && x.selected) != null)
            {
              var c = this.colorBoxes[0][parseInt(warp) - 1]?.color;
              box.color = c ? c : "";
              box.border = "warpBorder"
            } else {
              var c = this.colorBoxes[1][parseInt(weft) - 1]?.color;
              box.color = c ? c : "";
              box.border = "weftBorder"
            }
          }
        });
      }
    }, 5);
  }
}
