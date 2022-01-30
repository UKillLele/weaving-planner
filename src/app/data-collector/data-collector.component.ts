import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { Box } from 'src/models/box.model';
import { Pattern, Yarn, SRTColor } from 'src/models/pattern.model';
import { ApiService } from 'src/services/api.service';
import { WeavingService } from 'src/services/weaving.service';
import { ToastService } from 'src/services/toast.service';

declare let ntc: any;

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {
  @ViewChild('acc') accordionComponent!: NgbAccordion;
  
  pattern = new Pattern();
  savedPatterns: Pattern[] = [];
  user: any;
  previewAvailable: boolean = false;

  patternForm = this.fb.group({
    id: [ this.pattern.id ],
    name: [ this.pattern.name ],
    shafts: [ this.pattern.shafts ],
    treadles: [ this.pattern.treadles ],
    dpi: [ this.pattern.dpi ],
    epi: [ this.pattern.epi ],
    workingWidth: [ this.pattern.workingWidth ],
    selvageWidth: [ this.pattern.selvageWidth ],
    waste: [ this.pattern.waste ],
    trompAsWrit: [ this.pattern.trompAsWrit],
    halfSett: [ this.pattern.halfSett ],
    edgeType: [ this.pattern.edgeType ],
    edgeLength: [ this.pattern.edgeLength ],
    pieces: [ this.pattern.pieces ],
    patternWidth: [ this.pattern.patternWidth ],
    warpMaterial: [ this.pattern.warpMaterial ],
    warpTakeUp: [ this.pattern.warpTakeUp ],
    warpShrinkage: [ this.pattern.warpShrinkage ],
    ppi: [ this.pattern.ppi ],
    workingLength: [ this.pattern.workingLength ],
    patternLength: [ this.pattern.patternLength ],
    weftMaterial: [ this.pattern.weftMaterial ],
    weftTakeUp: [ this.pattern.weftTakeUp ],
    weftShrinkage: [ this.pattern.weftShrinkage ]
  });
    
  srtForm = this.fb.group({
    srtThreadcount: [ this.pattern.srtThreadcount ],
    srtPalette: [ this.pattern.srtPalette ]
  });
  
  YarnTypes = [
    {
      name: "cellulose",
      takeUp: 0,
      shrinkage: 10
    },
    {
      name: "cotton",
      takeUp: 10,
      shrinkage: 10
    },
    {
      name: "elastics",
      takeUp: 20,
      shrinkage: 0
    },
    {
      name: "linen",
      takeUp: 10,
      shrinkage: 10
    },
    {
      name: "other",
      takeUp: 0,
      shrinkage: 0
    },
    {
      name: "silk",
      takeUp: 0,
      shrinkage: 7
    },
    {
      name: "synthetic",
      takeUp: 10,
      shrinkage: 0
    },
    {
      name: "wool",
      takeUp: 15,
      shrinkage: 15
    }
  ]
  
  constructor(
    private weavingService: WeavingService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.apiService.user.subscribe(user => {
      this.user = user;
      if (user) this.getPatterns();
    });
    this.weavingService.shafts.subscribe((shafts: number) => {
      this.pattern.shafts = shafts;
    });
    this.weavingService.treadles.subscribe((treadles: number) => {
      this.pattern.treadles = treadles
    });
    this.weavingService.patternLength.subscribe((patternLength: number) => {
      this.pattern.patternLength = patternLength;
      this.calculateYarn();
    });
    this.weavingService.epi.subscribe((epi: number) => {
      this.pattern.epi = epi;
      this.calculateYarn();
    });
    this.weavingService.workingWidth.subscribe((workingWidth: number) => {
      this.pattern.workingWidth = workingWidth;
      this.calculateYarn();
    });
    this.weavingService.colorBoxes.subscribe((colorBoxes: Box[][]) => {
      this.pattern.colorBoxes = colorBoxes;
      this.calculateYarn();
    });
    this.weavingService.treadlingBoxes.subscribe((treadlingBoxes: Box[]) => {
      this.pattern.treadlingBoxes = treadlingBoxes;
      this.calculateYarn();
    });
    this.weavingService.threadingBoxes.subscribe((threadingBoxes: Box[]) => {
      this.pattern.threadingBoxes = threadingBoxes;
      this.calculateYarn();
    });
    this.weavingService.tieUpBoxes.subscribe((tieUpBoxes: Box[]) => {
      this.pattern.tieUpBoxes = tieUpBoxes;
    });
  }

  getPatterns() {
    this.apiService.getPatterns().then(resp => {
      if (resp.success) {
        this.savedPatterns = resp.data;
      }
    }).catch(error => {
      this.toastService.show({header: "Error", body: error});
    });
  }

  getPattern(patternId: UUID) {
    if (patternId) {
      this.apiService.getPattern(patternId).then(resp => {
        if (resp.success) {
          this.pattern = resp.data[0];
          this.patternForm.reset();
          this.patternForm.patchValue(this.pattern);
          this.onPatternSubmit();
        }
      }).catch(error => {
        this.toastService.show({header: "Error", body: error});
      });
    }
  }

  onPatternSubmit() {
    this.weavingService.changeShafts(this.patternForm.controls['shafts'].value);
    this.weavingService.changeTreadles(this.patternForm.controls['treadles'].value);
    this.weavingService.changeTromp(this.patternForm.controls['trompAsWrit'].value);
    this.weavingService.changeHalfSett(this.patternForm.controls['halfSett'].value);
    this.weavingService.changePatternLength(this.patternForm.controls['patternLength'].value);
    this.weavingService.changePatternWidth(this.patternForm.controls['patternWidth'].value);
    this.weavingService.changeEpi(this.patternForm.controls['epi'].value);
    this.weavingService.changeWorkingWidth(this.patternForm.controls['workingWidth'].value);
    this.weavingService.changeColorBoxes(this.pattern.colorBoxes);
    this.weavingService.changeThreadingBoxes(this.pattern.threadingBoxes);
    this.weavingService.changeTreadlingBoxes(this.pattern.treadlingBoxes);
    this.weavingService.changeTieUpBoxes(this.pattern.tieUpBoxes);
  }

  clearForm() {
    this.pattern = new Pattern();
    this.patternForm.reset();
    this.onPatternSubmit();
    this.weavingService.changeSelectedColor("");
  }

  savePattern() {
    if (this.user?.userId) {
      this.pattern.id = this.pattern.id && this.pattern.name == this.patternForm.controls['name'].value ? this.pattern.id : UUID.UUID();
      this.pattern.userId = this.pattern.userId;
      const pattern = {
        ...this.pattern,
        ...this.patternForm.value,
      }
      this.apiService.putPattern(pattern).then(resp => {
        if (resp.success) {
          this.apiService.getPatterns();
          this.getPattern(pattern.id);
        }
      }).catch(error => {
        this.toastService.show({header: "Error", body: error});
      });
    } else {
      this.toastService.show({header: "Error", body: "You must be logged in to save patterns."});
    }
  }

  onSrtSubmit() {
    this.pattern.colorBoxes = new Array<Box[]>(2);
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
            if (!this.pattern.colorBoxes[0]) this.pattern.colorBoxes[0] = new Array();
            const colorBox: Box = {
              border: "allBorders",
              color: colors.find(x => x.key === color).hex,
              id: `${this.pattern.colorBoxes[0].length + 1}-0`,
              selected: false,
              x: this.pattern.colorBoxes[0].length + 1,
              y: 0
            }
            this.pattern.colorBoxes[0].push(colorBox);
            if (this.patternForm.controls['trompAsWrit'].value === true) {
              if (!this.pattern.colorBoxes[1]) this.pattern.colorBoxes[1] = new Array();
              const verticalCB: Box = {
                border: "allBorders",
                color: colors.find(x => x.key === color).hex,
                id: `0-${this.pattern.colorBoxes[0].length + 1}`,
                selected: false,
                x: 0,
                y: this.pattern.colorBoxes[0].length + 1
              }
              this.pattern.colorBoxes[1].push(verticalCB);
            }
          }
        }
      }
    });
    // set patternWidth
    this.patternForm.controls['patternWidth'].setValue(this.pattern.colorBoxes[0].length);
    this.patternWidthChanged();
    this.modalService.dismissAll();
  }

  dpichanged() {
    if (this.patternForm.controls['epi'].value !== null) {
      this.calculateSleyOrder();
    }
  }

  epiChanged() {
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      this.patternForm.controls['ppi'].setValue(this.patternForm.controls['epi'].value);
    }
    if (this.patternForm.controls['dpi'].value !== null) {
      this.calculateSleyOrder();
    }
  }

  calculateSleyOrder() {
    // WIP
    const ends = this.patternForm.controls['epi'].value;
    const dents = this.patternForm.controls['dpi'].value;
    const base = Math.floor(ends / dents);
    const remainder = ends % dents;
    const repeats = dents - remainder;
    let distribution = Math.floor(remainder / repeats) + 1;
    const sleyOrder = [];
    if (distribution === 1 && remainder % repeats !== 0) {
      distribution = Math.floor(repeats / remainder) + 1;
      for (let i = 1; i <= distribution; i++) {
        if (i % distribution === 0) sleyOrder.push(base + 1);
        else sleyOrder.push(base);
      }
      let threads = 0;
      sleyOrder.forEach(dent => threads += dent);
      const dentRepeats = Math.floor(ends / threads);
      const endsRemainder = ends - (dentRepeats * threads);
      const x = Math.floor(endsRemainder / (base));
    } else {
      for (let i = 1; i <= distribution; i++) {
        if (i % distribution === 0) sleyOrder.push(base);
        else sleyOrder.push(base + 1);
      }
    }
    this.pattern.sleyOrder = sleyOrder;
    let sleyTotal = 0;
    sleyOrder.forEach(sley => sleyTotal += sley);
    const sleyEpi = Math.floor(dents * (sleyTotal / sleyOrder.length));
    this.pattern.sleyEpi = sleyEpi !== ends ? `(${sleyEpi} epi)` : "";
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

  yarnChanged(place: string) {
    if (place === "warp") {
      const type = this.YarnTypes.find(yarn => yarn.name === this.patternForm.controls['warpMaterial'].value);
      this.patternForm.controls['warpTakeUp'].setValue(type?.takeUp ?? 0);
      this.patternForm.controls['warpShrinkage'].setValue(type?.shrinkage ?? 0);
    } else {
      const type = this.YarnTypes.find(yarn => yarn.name === this.patternForm.controls['weftMaterial'].value);
      this.patternForm.controls['weftTakeUp'].setValue(type?.takeUp ?? 0);
      this.patternForm.controls['weftShrinkage'].setValue(type?.shrinkage ?? 0);
    }
  }

  calculateYarn() {
    if (this.pattern.colorBoxes && this.pattern.threadingBoxes && this.pattern.treadlingBoxes && this.patternForm.controls['workingWidth'].value > 0 && this.patternForm.controls['workingLength'].value > 0) {
      this.pattern.colors = new Array();
      this.pattern.weftIn = 0;
      this.pattern.warpIn = 0;
      this.pattern.totalIn = 0;
      this.pattern.colorBoxes.forEach(section => {
        section.forEach(colorBox => {
          const namedColor = ntc.name(colorBox.color);
          if (!namedColor[1].toLowerCase().includes("invalid")) {
            const color: Yarn = new Yarn();
            color.colorCode = colorBox.color;
            color.colorName = namedColor[1];
            color.perfectMatch = namedColor[2];
            if (color && !this.pattern.colors.map(x => x.colorName).includes(color.colorName)) {
              this.pattern.colors.push(color);
            }
          }
        });
      });
      // calculate number of weft and warp threads of color times width and length
      // TODO: account for half sett
      // weft threads
      this.pattern.treadlingBoxes.forEach(weft => {
        const colorBox = this.pattern.colorBoxes[1].find(x => x.y == weft.y);
        const color = this.pattern.colors.find(x => x.colorCode === colorBox?.color)
        if (color) {
          let inches = 0;
          inches= (this.patternForm.controls['workingWidth'].value * this.patternForm.controls['ppi'].value) ?? 0;
          color.colorInches += inches;
          this.pattern.weftIn += inches;
        }
      });

      // warp threads
      this.pattern.threadingBoxes.forEach(warp => {
        const colorBox = this.pattern.colorBoxes[0].find(x => x.x == warp.x);
        const color = this.pattern.colors.find(x => x.colorCode == colorBox?.color)
        if (color) {
          let inches = 0;
          inches += (this.patternForm.controls['workingLength'].value * this.patternForm.controls['epi'].value) ?? 0;
          inches += this.patternForm.controls['waste'].value ?? 0;
          inches += (this.patternForm.controls['selvageWidth'].value * 2) ?? 0;
          inches += (this.patternForm.controls['edgeLength'].value * 2 * this.patternForm.controls['pieces'].value) ?? 0;
          color.colorInches += inches;
          this.pattern.warpIn += inches;
        }
      });

      this.pattern.totalIn = this.pattern.warpIn + this.pattern.weftIn;
    }
  }
  
  open(content: any) {
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}

