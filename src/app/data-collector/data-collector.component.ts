import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  
  @ViewChild('srtDialog') srtDialog!: TemplateRef<any>;

  constructor(
    private weavingService: WeavingService,
    public dialog: MatDialog
  ) { }

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

  openSRT() {
    this.dialog.open(this.srtDialog);
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
              selected: false
            }
            this.colorBoxes[0].push(colorBox);
            if (this.trompAsWrit) {
              if (!this.colorBoxes[1]) this.colorBoxes[1] = new Array();
              colorBox.id = `0-${this.colorBoxes[1].length + 1}`;
              this.colorBoxes[1].push(colorBox);
            }
          }
        }
      }
    });
    this.colorBoxesChanged();
    // set patternWidth
    this.patternWidth = this.colorBoxes[0].length;
    this.patternWidthChanged();
  }

  shaftsChanged() {
    this.shafts? this.weavingService.changeShafts(this.shafts) : null;
  }
  treadlesChanged() {
    this.treadles ? this.weavingService.changeTreadles(this.treadles) : null;
  }
  trompChanged() {
    this.weavingService.changeTromp(this.trompAsWrit);
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
      this.patternLengthChanged();
    }
  }
  halfSettChanged() {
    this.weavingService.changeHalfSett(this.halfSett);
  }
  patternLengthChanged() {
    this.patternLength ? this.weavingService.changePatternLength(this.patternLength) : null;
  }
  patternWidthChanged() {
    this.patternWidth ? this.weavingService.changePatternWidth(this.patternWidth) : null;
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
      this.patternLengthChanged();
    }
  }
  epiChanged() {
    this.epi ? this.weavingService.changeEpi(this.epi) : null;
  }
  workingWidthChanged() {
    this.workingWidth ? this.weavingService.changeWorkingWidth(this.workingWidth) : null;
  }
  colorBoxesChanged() {
    this.colorBoxes ? this.weavingService.changeColorBoxes(this.colorBoxes) : null;
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
      // weft threads
      this.treadlingBoxes.forEach(weft => {
        const colorBox = this.colorBoxes[1].find(x => x.id.substring(x.id.indexOf("-")) == weft.id.substring(x.id.indexOf("-")));
        const color = this.colors.find(x => x.colorCode === colorBox?.color)
        if (color) {
          color.colorInches += this.workingWidth ?? 0;
          this.weftIn += this.workingWidth ?? 0;
          this.totalIn += this.workingWidth ?? 0;
        }
      });
      // warp threads
      this.threadingBoxes.forEach(warp => {
        const colorBox = this.colorBoxes[0].find(x => x.id.substring(0, x.id.indexOf("-")) == warp.id.substring(0, x.id.indexOf("-")));
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
