import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  shafts: number | null = null;
  treadles: number | null = null;
  epi: number | null = null;
  workingWidth: number | null = null;
  selvageWidth: number | null = null;
  waste: number | null = null;
  trompAsWrit: boolean = false;
  halfSett: boolean = false;
  edgeType: string = "";
  edgeLength: number | null = null;
  pieces: number | null = null;
  patternWidth: number | null = null;
  warpMaterial: string = "";
  warpDrawIn: number | null = null;
  warpShrinkage: number | null = null;
  ppi: number | null = null;
  workingLength: number | null = null;
  patternLength: number | null = null;
  weftMaterial: string = "";
  weftDrawIn: number | null = null;
  weftShrinkage: number | null = null;
  colorBoxes: Box[][] = [];
  threadingBoxes: Box[] = [];
  treadlingBoxes: Box[] = [];
  colors: Yarn[] = [];
  weftIn: number = 0;
  warpIn: number = 0;
  totalIn: number = 0;
  srtThreadcount: string = "";
  srtPalette: string = "";
  viewPatternInfo: boolean = true;
  
  @ViewChild('srtDialog') srtDialog!: TemplateRef<any>;

  constructor(
    private weavingService: WeavingService,
   // public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.shafts = shafts;
      this.calculateYarn();
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.treadles = treadles;
      this.calculateYarn();
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternLength = patternLength;
      this.calculateYarn();
    });
    this.weavingService.epi.subscribe((epi: number) => {
      this.epi = epi;
      this.calculateYarn();
    });
    this.weavingService.workingWidth.subscribe((workingWidth: number) => {
      this.workingWidth = workingWidth;
      this.calculateYarn();
    });
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

  update() {
    this.shafts? this.weavingService.changeShafts(this.shafts) : null;
    this.treadles ? this.weavingService.changeTreadles(this.treadles) : null;
    this.weavingService.changeTromp(this.trompAsWrit);
    this.weavingService.changeHalfSett(this.halfSett);
    this.patternLength ? this.weavingService.changePatternLength(this.patternLength) : null;
    this.patternWidth ? this.weavingService.changePatternWidth(this.patternWidth) : null;
    this.epi ? this.weavingService.changeEpi(this.epi) : null;
    this.workingWidth ? this.weavingService.changeWorkingWidth(this.workingWidth) : null;
    this.colorBoxes ? this.weavingService.changeColorBoxes(this.colorBoxes) : null;
    this.viewPatternInfo = false;
  }

  openSRT() {
    // this.dialog.open(this.srtDialog);
  }

  useSRT() {
    this.colorBoxes = new Array<Box[]>(2);
    // add colors to palette
    const colors = new Array();
    const rawColors = this.srtPalette.split(";");
    rawColors.forEach(color => {
      const srtColor: SRTColor = {
        key: color.slice(0, color.indexOf("=")),
        hex: `#${color.slice(color.indexOf("=") + 1, color.indexOf("=") + 7)}`
      }
      colors.push(srtColor);
    });
    this.weavingService.changeColorPalette(colors.map(x => x.hex));
    // parse each set of numbers from threadcount
    const sections = this.srtThreadcount.split(/([A-Z]+\d+)/);
    sections.forEach(group => {
      if (group != '') {
        const count = Number(group.replace(/(\D+)/, ""));
        const color = group.replace(/(\d+)/, "");
        // set colorBoxes
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            if (!this.colorBoxes[0]) this.colorBoxes[0] = new Array();
            const colorBox: Box = {
              border: "allBorders",
              color: colors.find(x => x.key === color).hex,
              id: `${this.colorBoxes[0].length + 1}-0`,
              selected: false,
              x: this.colorBoxes[0].length + 1,
              y: 0
            }
            this.colorBoxes[0].push(colorBox);
            if (this.trompAsWrit) {
              if (!this.colorBoxes[1]) this.colorBoxes[1] = new Array();
              const verticalCB: Box = {
                border: "allBorders",
                color: colors.find(x => x.key === color).hex,
                id: `0-${this.colorBoxes[0].length + 1}`,
                selected: false,
                x: 0,
                y: this.colorBoxes[0].length + 1
              }
              this.colorBoxes[1].push(verticalCB);
            }
          }
        }
      }
    });
    // set patternWidth
    this.patternWidth = this.colorBoxes[0].length;
    this.patternWidthChanged();
  }

  trompChanged() {
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
      this.ppi = this.epi;
    }
  }
  patternWidthChanged() {
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
    }
  }

  calculateYarn() {
    if (this.colorBoxes && this.threadingBoxes && this.treadlingBoxes && this.workingWidth && this.workingLength) {
      this.colors = new Array();
      this.weftIn = 0;
      this.warpIn = 0;
      this.totalIn = 0;
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
      // TODO: add multipliers (e.g. repeats) and additions (e.g. selvage, fringe)
      // weft threads
      this.treadlingBoxes.forEach(weft => {
        const colorBox = this.colorBoxes[1].find(x => x.y == weft.y);
        const color = this.colors.find(x => x.colorCode === colorBox?.color)
        if (color) {
          color.colorInches += this.workingWidth ?? 0;
          this.weftIn += this.workingWidth ?? 0;
          this.totalIn += this.workingWidth ?? 0;
        }
      });
      // warp threads
      this.threadingBoxes.forEach(warp => {
        const colorBox = this.colorBoxes[0].find(x => x.x == warp.x);
        const color = this.colors.find(x => x.colorCode == colorBox?.color)
        if (color) {
          color.colorInches += this.workingLength ?? 0;
          this.warpIn += this.workingLength ?? 0;
          this.totalIn += this.workingLength ?? 0;
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

class SRTColor {
  key: string = "";
  hex: string = "";
}
