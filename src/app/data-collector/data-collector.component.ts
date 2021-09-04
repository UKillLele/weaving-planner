import { Component, OnInit } from '@angular/core';
import { Box } from 'src/models/box.model';
import { WeavingService } from 'src/services/weaving.service';
declare let ntc: any;

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {

  name: string = "";
  shafts: number = 0;
  treadles: number = 0;
  epi: number = 0;
  workingWidth: number = 0;
  selvageWidth: number = 0;
  waste: number = 0;
  trompAsWrit: boolean = false;
  halfSett: boolean = false;
  edgeType: string = "";
  edgeLength: number = 0;
  pieces: number = 0;
  patternWidth: number = 0;
  warpMaterial: string = "";
  warpDrawIn: number = 0;
  warpShrinkage: number = 0;
  ppi: number = 0;
  workingLength: number = 0;
  patternLength: number = 0;
  weftMaterial: string = "";
  weftDrawIn: number = 0;
  weftShrinkage: number = 0;
  colorBoxes: Box[][] = [];
  threadingBoxes: Box[] = [];
  treadlingBoxes: Box[] = [];
  colors: Yarn[] = [];
  weftYds: number = 0;
  warpYds: number = 0;
  totalYds: number = 0;

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.shafts.subscribe((shafts: number) => this.shafts = shafts);
    this.weavingService.treadles.subscribe((treadles: number) => this.treadles = treadles);
    this.weavingService.trompAsWrit.subscribe((trompAsWrit: boolean) => this.trompAsWrit = trompAsWrit);
    this.weavingService.halfSett.subscribe((halfSett: boolean) => this.halfSett = halfSett);
    this.weavingService.patternLength.subscribe((patternLength: number) => this.patternLength = patternLength);
    this.weavingService.epi.subscribe((epi: number) => this.epi = epi);
    this.weavingService.workingWidth.subscribe((workingWidth: number) => this.workingWidth = workingWidth);
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => {
      this.colorBoxes = colorBoxes;
      this.calculateYarn();
    });
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => {
      this.treadlingBoxes = treadlingBoxes;
      this.calculateYarn();
    });
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => {
      this.threadingBoxes = threadingBoxes;
      this.calculateYarn();
    });
  }

  toggleTromp() {
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
      this.ppi = this.epi;
    }
  }

  shaftsChanged() {
    this.weavingService.changeShafts(this.shafts);
  }
  treadlesChanged() {
    this.weavingService.changeTreadles(this.treadles);
  }
  trompChanged() {
    this.weavingService.changeTromp(this.trompAsWrit);
  }
  halfSettChanged() {
    this.weavingService.changeHalfSett(this.halfSett);
  }
  patternLengthChanged() {
    this.weavingService.changePatternLength(this.patternLength);
  }
  epiChanged() {
    this.weavingService.changeEpi(this.epi);
  }
  workingWidthChanged() {
    this.weavingService.changeWorkingWidth(this.workingWidth);
  }

  calculateYarn() {
    if (this.colorBoxes && this.threadingBoxes && this.treadlingBoxes && this.workingWidth && this.workingLength) {
      this.colors = new Array();
      this.weftYds = 0;
      this.warpYds = 0;
      this.totalYds = 0;
      this.colorBoxes.forEach(section => {
        section.forEach(colorBox => {
          const namedColor = ntc.name(colorBox.color);
          if (!namedColor[1].toLowerCase().includes("invalid")) {
            const color: Yarn = new Yarn();
            color.colorCode = colorBox.color;
            color.colorName = namedColor[1];
            color.perfectMatch = namedColor[2];
            if (color && !this.colors.map(x => x.colorName).includes(color.colorName)) {
              this.colors.push(color);
            }
          }
        });
      });
      // calculate number of weft and warp threads of color times width and length
      // weft threads
      this.treadlingBoxes.forEach(weft => {
        const colorBox = this.colorBoxes[1].find(x => x.id.substring(x.id.indexOf("-")) == weft.id.substring(x.id.indexOf("-")));
        const color = this.colors.find(x => x.colorCode === colorBox?.color)
        if (color) {
          color.colorInches += this.workingWidth;
          this.weftYds += this.workingWidth;
          this.totalYds += this.workingWidth;
        }
      });
      // warp threads
      this.threadingBoxes.forEach(warp => {
        const colorBox = this.colorBoxes[0].find(x => x.id.substring(0, x.id.indexOf("-")) == warp.id.substring(0, x.id.indexOf("-")));
        const color = this.colors.find(x => x.colorCode == colorBox?.color)
        if (color) {
          color.colorInches += this.workingLength;
          this.warpYds += this.workingLength;
          this.totalYds += this.workingLength;
        }
      });
    }
  }
}

class Yarn {
  colorName: string = "";
  colorCode: string = "";
  colorInches: number = 0;
  perfectMatch: boolean = false;
}
