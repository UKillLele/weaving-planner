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
        border: "weftBorder"
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
        this.tieUpBoxes?.forEach(tieUpBox => {
          if (tieUpBox.selected) {
            const tieUpX = tieUpBox.id.substring(0, tieUpBox.id.indexOf("-"));
            const treadlingBoxes: string[] = [];
            this.treadlingBoxes?.forEach(treadlingBox => {
              if (treadlingBox.id.substring(0, treadlingBox.id.indexOf(("-"))) == tieUpX && treadlingBox.selected) treadlingBoxes.push(treadlingBox.id);
            });
            const tieUpY = tieUpBox.id.substring(tieUpBox.id.indexOf("-") + 1);
            const upRows = this.tieUpBoxes.filter(x => x.id.substring(0, x.id.indexOf(("-"))) == tieUpX && x.selected).map(box => box.id.substring(box.id.indexOf("-") + 1));
            const selectedThreadingBoxes: string[] = [];
            const threadingBoxes: string[] = [];
            this.threadingBoxes?.forEach(threadingBox => {
              const boxRow = threadingBox.id.substring(threadingBox.id.indexOf("-") + 1);
              if (boxRow == tieUpY && threadingBox.selected) selectedThreadingBoxes.push(threadingBox.id);
              else if (!upRows.includes(boxRow) && threadingBox.selected) threadingBoxes.push(threadingBox.id);
            });
            treadlingBoxes.forEach(treadlingBox => {
              threadingBoxes.forEach(threadingBox => {
                const x = threadingBox.substring(0, threadingBox.indexOf("-"));
                const y = treadlingBox.substring(treadlingBox.indexOf("-") + 1);
                const selectedIndex = this.visualizerBoxes.findIndex(z => z.id == `${x}-${y}`);
                this.visualizerBoxes[selectedIndex].border = 'weftBorder';
                this.visualizerBoxes[selectedIndex].color = this.colorBoxes && this.colorBoxes[1] && this.colorBoxes[1][parseInt(y) - 1] ? this.colorBoxes[1][parseInt(y) - 1].color : "transparent";
              });
              selectedThreadingBoxes.forEach(threadingBox => {
                const x = threadingBox.substring(0, threadingBox.indexOf("-"));
                const y = treadlingBox.substring(treadlingBox.indexOf("-") + 1);
                const selectedIndex = this.visualizerBoxes.findIndex(z => z.id == `${x}-${y}`);
                this.visualizerBoxes[selectedIndex].border = 'warpBorder';
                this.visualizerBoxes[selectedIndex].color = this.colorBoxes && this.colorBoxes[0] && this.colorBoxes[0][parseInt(x) - 1] ? this.colorBoxes[0][parseInt(x) - 1].color : "transparent";
              });
            });
          }
        });
      }
    }, 5);
  }
}
