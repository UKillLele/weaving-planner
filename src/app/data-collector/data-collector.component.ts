import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Box } from 'src/models/box.model';
import { ApiService } from 'src/services/api.service';
import { WeavingService } from 'src/services/weaving.service';
declare let ntc: any;

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {
  @ViewChild('acc') accordionComponent!: NgbAccordion;
  
  patternForm = this.fb.group({
    name: [ "" ],
    shafts: [ null ],
    treadles: [ null ],
    epi: [ null ],
    workingWidth: [ null ],
    selvageWidth: [ null ],
    waste: [ null ],
    trompAsWrit: [ false ],
    halfSett: [ false ],
    edgeType: [ "" ],
    edgeLength: [ null ],
    pieces: [ null ],
    patternWidth: [ null ],
    warpMaterial: [ "" ],
    warpDrawIn: [ null ],
    warpShrinkage: [ null ],
    ppi: [ null ],
    workingLength: [ null ],
    patternLength: [ null ],
    weftMaterial: [ "" ],
    weftDrawIn: [ null ],
    weftShrinkage: [ null ]
  });
  srtForm = this.fb.group({
    srtThreadcount: [ "" ],
    srtPalette: [ "" ]
  });
  colorBoxes: Box[][] = [];
  threadingBoxes: Box[] = [];
  treadlingBoxes: Box[] = [];
  colors: Yarn[] = [];
  weftIn: number = 0;
  warpIn: number = 0;
  totalIn: number = 0;
  apiResponse: string = "";
  
  constructor(
    private weavingService: WeavingService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.apiResponse = this.apiService.getPatterns();
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.patternForm.controls['shafts'].setValue(shafts);
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.patternForm.controls['treadles'].setValue(treadles);
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.patternForm.controls['patternLength'].setValue(patternLength);
      this.calculateYarn();
    });
    this.weavingService.epi.subscribe((epi: number) => {
      this.patternForm.controls['epi'].setValue(epi);
      this.calculateYarn();
    });
    this.weavingService.workingWidth.subscribe((workingWidth: number) => {
      this.patternForm.controls['workingWidth'].setValue(workingWidth);
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

  onPatternSubmit() {
    this.weavingService.changeShafts(this.patternForm.controls['shafts'].value ?? null);
    this.weavingService.changeTreadles(this.patternForm.controls['treadles'].value ?? null);
    this.weavingService.changeTromp(this.patternForm.controls['trompAsWrit'].value);
    this.weavingService.changeHalfSett(this.patternForm.controls['halfSett'].value);
    this.weavingService.changePatternLength(this.patternForm.controls['patternLength'].value ?? null);
    this.weavingService.changePatternWidth(this.patternForm.controls['patternWidth'].value ?? null);
    this.weavingService.changeEpi(this.patternForm.controls['epi'].value ?? null);
    this.weavingService.changeWorkingWidth(this.patternForm.controls['workingWidth'].value ?? null);
    this.weavingService.changeColorBoxes(this.colorBoxes ?? null);
    this.accordionComponent.toggle('patternInfo');
  }

  onSrtSubmit() {
    this.colorBoxes = new Array<Box[]>(2);
    // add colors to palette
    const colors = new Array();
    const rawColors = this.srtForm.controls['srtPalette'].value.split(";");
    rawColors.forEach((color: string) => {
      color = color.replace("\n", "");
      if (color.length > 0) {
        const srtColor: SRTColor = {
          key: color.slice(0, color.indexOf("=")),
          hex: `#${color.slice(color.indexOf("=") + 1, color.indexOf("=") + 7)}`
        }
        colors.push(srtColor);
      }
    });
    this.weavingService.changeColorPalette(colors.map(x => x.hex));
    // parse each set of numbers from threadcount
    const sections = this.srtForm.controls['srtThreadcount'].value.split(/([A-Z]+\d+)/);
    sections.forEach((group: string) => {
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
            if (this.patternForm.controls['trompAsWrit'].value === true) {
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
    this.patternForm.controls['patternWidth'].setValue(this.colorBoxes[0].length);
    this.patternWidthChanged();
    this.modalService.dismissAll();
  }

  epiChanged() {
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      this.patternForm.controls['ppi'].setValue(this.patternForm.controls['epi'].value);
    }
  }

  trompChanged() {
    const patternLength = this.patternForm.controls['patternLength'];
    const ppi = this.patternForm.controls['ppi'];
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      patternLength.setValue(this.patternForm.controls['patternWidth'].value);
      patternLength.disable();
      ppi.setValue(this.patternForm.controls['epi'].value);
      ppi.disable();
    } else {
      patternLength.enable();
      ppi.enable();
    }
  }

  settChanged() {
    if (this.patternForm.controls['halfSett'].value === true) {
      // TODO
    }
  }

  patternWidthChanged() {
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      this.patternForm.controls['patternLength'].setValue(this.patternForm.controls['patternWidth'].value);
    }
  }

  calculateYarn() {
    if (this.colorBoxes && this.threadingBoxes && this.treadlingBoxes && this.patternForm.controls['workingWidth'].value > 0 && this.patternForm.controls['workingLength'].value > 0) {
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
      // TODO: account for half sett
      // weft threads
      this.treadlingBoxes.forEach(weft => {
        const colorBox = this.colorBoxes[1].find(x => x.y == weft.y);
        const color = this.colors.find(x => x.colorCode === colorBox?.color)
        if (color) {
          let inches = 0;
          inches= (this.patternForm.controls['workingWidth'].value * this.patternForm.controls['ppi'].value) ?? 0;
          color.colorInches += inches;
          this.weftIn += inches;
        }
      });

      // warp threads
      this.threadingBoxes.forEach(warp => {
        const colorBox = this.colorBoxes[0].find(x => x.x == warp.x);
        const color = this.colors.find(x => x.colorCode == colorBox?.color)
        if (color) {
          let inches = 0;
          inches += (this.patternForm.controls['workingLength'].value * this.patternForm.controls['epi'].value) ?? 0;
          inches += this.patternForm.controls['waste'].value ?? 0;
          inches += (this.patternForm.controls['selvageWidth'].value * 2) ?? 0;
          inches += (this.patternForm.controls['edgeLength'].value * 2 * this.patternForm.controls['pieces'].value) ?? 0;
          color.colorInches += inches;
          this.warpIn += inches;
        }
      });

      this.totalIn = this.warpIn + this.weftIn;
    }
  }
  
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
