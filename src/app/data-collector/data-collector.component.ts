import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  editing: string = "";
  ashenhurst: number = 0;
  sampleWidth: number = 0;

  patternForm = this.fb.group({
    id: [ this.pattern.id ],
    name: [ this.pattern.name ],
    shafts: [ this.pattern.shafts ],
    treadles: [ this.pattern.treadles ],
    dpi: [ this.pattern.dpi ],
    finishedWidth: [ this.pattern.finishedWidth ],
    selvedgeWidth: [ this.pattern.selvedgeWidth ],
    waste: [ this.pattern.waste ],
    trompAsWrit: [ this.pattern.trompAsWrit],
    halfSett: [ this.pattern.halfSett ],
    topEdgeType: [ this.pattern.topEdgeType ],
    topEdgeLength: [ this.pattern.topEdgeLength ],
    bottomEdgeType: [ this.pattern.bottomEdgeType ],
    bottomEdgeLength: [ this.pattern.bottomEdgeLength ],
    pieces: [ this.pattern.pieces ],
    patternWidth: [ this.pattern.patternWidth ],
    warpMaterial: [ this.pattern.warpMaterial ],
    warpTakeUp: [ this.pattern.warpTakeUp ],
    warpShrinkage: [ this.pattern.warpShrinkage ],
    finishedLength: [ this.pattern.finishedLength ],
    patternLength: [ this.pattern.patternLength ],
    weftMaterial: [ this.pattern.weftMaterial ],
    weftTakeUp: [ this.pattern.weftTakeUp ],
    weftShrinkage: [ this.pattern.weftShrinkage ],
    weftLeftFringe: [ this.pattern.weftLeftFringe ],
    weftRightFringe: [ this.pattern.weftRightFringe ],
    sampleLength: [ this.pattern.sampleLength ],
    sampleOffLoomLength: [ this.pattern.sampleOffLoomLength ],
    sampleAfterWashLength: [ this.pattern.sampleAfterWashLength ],
    sampleOffLoomWidth: [ this.pattern.sampleOffLoomWidth ],
    sampleAfterWashWidth: [ this.pattern.sampleAfterWashWidth ],
    newYarnTypeWarp: [ this.pattern.newYarnTypeWarp ],
    newYarnTypeWeft: [ this.pattern.newYarnTypeWeft ]
  });
    
  srtForm = this.fb.group({
    srtThreadcount: [ this.pattern.srtThreadcount ],
    srtPalette: [ this.pattern.srtPalette ]
  });

  settForm = this.fb.group({
    ypp: [],
    yarnType: [],
    density: [],
    sett: []
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

  densities = [
    {
      percent: "100%",
      weave: "plain weave",
      example: "- maximum",
      calc: .5
    },
    {
      percent: "90%",
      weave: "plain weave",
      example: null,
      calc: .45
    },
    {
      percent: "80%",
      weave: "plain weave",
      example: null,
      calc: .4
    },
    {
      percent: "70%",
      weave: "plain weave",
      example: "- clothing",
      calc: .35
    },
    {
      percent: "65%",
      weave: "plain weave",
      example: null,
      calc: .325
    },
    {
      percent: "60%",
      weave: "plain weave",
      example: null,
      calc: .3
    },
    {
      percent: "50%",
      weave: "plain weave",
      example: "- lace",
      calc: .25
    },
    {
      percent: null,
      weave: "twill",
      example: null,
      calc: .67
    },
    {
      percent: null,
      weave: "satin",
      example: null,
      calc: .71
    },
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
      if (user?.userId && this.user !== user) this.getPatterns();
      this.user = user;
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
    this.clearForm();
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

  getContrastText(hex: string) {
    const [r, g, b] = [1, 3, 5].map( p => parseInt( hex.substring( p, p + 2 ), 16 ) ); 	
    return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128 ? 'black' : 'white';
  }

  onPatternSubmit() {
    this.calculateYarn();
    this.weavingService.changeShafts(this.patternForm.controls['shafts'].value);
    this.weavingService.changeTreadles(this.patternForm.controls['treadles'].value);
    this.weavingService.changeTromp(this.patternForm.controls['trompAsWrit'].value);
    this.weavingService.changeHalfSett(this.patternForm.controls['halfSett'].value);
    this.weavingService.changePatternLength(this.patternForm.controls['patternLength'].value);
    this.weavingService.changePatternWidth(this.patternForm.controls['patternWidth'].value);
    this.weavingService.changeEpi(this.pattern.epi);
    this.weavingService.changefinishedWidth(this.patternForm.controls['finishedWidth'].value);
    this.weavingService.changeColorBoxes(this.pattern.colorBoxes);
    this.weavingService.changeThreadingBoxes(this.pattern.threadingBoxes);
    this.weavingService.changeTreadlingBoxes(this.pattern.treadlingBoxes);
    this.weavingService.changeTieUpBoxes(this.pattern.tieUpBoxes);
    this.weavingService.changeColorPalette(this.pattern.colors.map(x => x.colorCode));
  }

  clearForm() {
    this.pattern = new Pattern();
    this.patternForm.reset();
    this.onPatternSubmit();
    this.weavingService.changeSelectedColor("");
  }

  savePattern() {
    if (this.user?.userId) {
      this.pattern.userId = this.user.userId;
      const pattern = {
        ...this.pattern,
        ...this.patternForm.value,
      }
      if (!this.pattern.id || this.pattern.name !== this.patternForm.controls['name'].value) pattern.id = UUID.UUID();
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
      if (group !== '') {
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

  dpiChanged() {
    if (this.pattern.epi !== null) {
      this.calculateSleyOrder();
    }
  }

  epiChanged() {
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      this.pattern.ppi = this.pattern.epi;
    }
    if (this.patternForm.controls['dpi'].value !== null) {
      this.calculateSleyOrder();
    }
  }

  edgeTypeChanged() {
    if (!this.patternForm.controls['bottomEdgeType'].value) {
      this.patternForm.controls['bottomEdgeType'].setValue(this.patternForm.controls['topEdgeType'].value);
    } else if (!this.patternForm.controls['topEdgeType'].value) {
      this.patternForm.controls['topEdgeType'].setValue(this.patternForm.controls['bottomEdgeType'].value)
    }
  }

  edgeChanged(side: string) {
    if (side === "warp") {
      if(this.patternForm.controls['bottomEdgeLength'].value < 1) {
        this.patternForm.controls['bottomEdgeLength'].setValue(this.patternForm.controls['topEdgeLength'].value);
      } else if (this.patternForm.controls['topEdgeLength'].value < 1) {
        this.patternForm.controls['topEdgeLength'].setValue(this.patternForm.controls['bottomEdgeLength'].value);
      }
    } else {
      if(this.patternForm.controls['weftLeftFringe'].value < 1) {
        this.patternForm.controls['weftLeftFringe'].setValue(this.patternForm.controls['weftRightFringe'].value);
      } else if (this.patternForm.controls['weftRightFringe'].value < 1) {
        this.patternForm.controls['weftRightFringe'].setValue(this.patternForm.controls['weftLeftFringe'].value);
      }
    }
  }

  calculateSleyOrder() {
    // WIP
    const ends = this.pattern.epi!;
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
    if (this.patternForm.controls['trompAsWrit'].value === true) {
      patternLength.setValue(this.patternForm.controls['patternWidth'].value);
      patternLength.disable();
      this.pattern.ppi = this.pattern.epi;
    } else {
      patternLength.enable();
    }
  }

  settChanged() {
    // TODO
    if (this.patternForm.controls['halfSett'].value === true) {
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

  calculatePrice(colorCode: string) {
    const color = this.pattern.colors.find(x => x.colorCode === colorCode);
    if (color && color.colorUnitYds && color.colorPricePerUnit) {
      color.colorUnitsNeeded = Math.ceil(color.colorYds / color.colorUnitYds);
      color.colorTotalPrice = color.colorPricePerUnit * color.colorUnitsNeeded;
      let price = 0;
      this.pattern.colors.forEach(col => {
        price += col.colorTotalPrice ?? 0;
      });
      this.pattern.totalPrice = price;
    }
  }

  calculateYarn() {
    if (this.patternForm.controls['finishedWidth'].value > 0 && this.patternForm.controls['finishedLength'].value > 0) {
      let colors = new Array();
      let weftIn = 0;
      let warpIn = 0;
      const waste = this.patternForm.controls['waste'].value ?? 0;
      const fringe = this.patternForm.controls['topEdgeLength'].value ?? 0 + this.patternForm.controls['bottomEdgeLength'].value ?? 0;
      const sampleLength = this.patternForm.controls['sampleLength'].value ?? 0;
      // TODO: account for half sett
      this.pattern.lengthOnLoom = 
        (
          (
            ( // lengths that get multplied by pieces
              this.patternForm.controls['finishedLength'].value // required
              + fringe
            ) 
            * (this.patternForm.controls['pieces'].value ?? 1)
          ) // used once but still shrinks
          + sampleLength
        ) * ( //1.xx%, to accomodate shrinkage and take-up
          1 + 
          (
            (
              (this.patternForm.controls['warpTakeUp'].value ?? 0)
              + (this.patternForm.controls['warpShrinkage'].value ?? 0)
            )
            /100
          )
        ) // used once and doesn't shrink
      + (waste);
      this.pattern.widthInReed = 
        (
          this.patternForm.controls['finishedWidth'].value // required
          + (this.patternForm.controls['weftLeftFringe'].value ?? 0)
          + (this.patternForm.controls['weftRightFringe'].value ?? 0)
        ) * (
          1 +
          (
            (
              (this.patternForm.controls['weftTakeUp'].value ?? 0)
              + (this.patternForm.controls['weftShrinkage'].value ?? 0)
            )
            /100
          )
        );
        this.pattern.widthInReedNoFringe = 
          (
            this.patternForm.controls['finishedWidth'].value // required
          ) * (
            1 +
            (
              (
                (this.patternForm.controls['weftTakeUp'].value ?? 0)
                + (this.patternForm.controls['weftShrinkage'].value ?? 0)
              )
              /100
            )
          );
        if (!this.patternForm.controls['weftTakeUp'].value && !this.patternForm.controls['weftShrinkage'].value) {
          this.sampleWidth = this.pattern.widthInReedNoFringe;
        }

      // length pattern repeats
      this.pattern.lpr = 1;
      const wovenLength = this.pattern.lengthOnLoom - waste - fringe - sampleLength;
      if (this.patternForm.controls['patternLength'].value > 0) {
        // (length * ppi) / pattern length
        this.pattern.lpr = (wovenLength * this.pattern.ppi!) / this.patternForm.controls['patternLength'].value;
      } else {
        this.pattern.patternLength = Math.round(wovenLength * this.pattern.ppi!);
      }
      // weft threads
      this.pattern.treadlingBoxes?.forEach(weft => {
        if (weft.selected) {
          const colorBox = this.pattern.colorBoxes[1]?.find(x => x.y == weft.y);
          if (!colors.map(x => x.colorCode).find(x => x === colorBox?.color)) {
            const color = new Yarn();
            color.colorCode = colorBox?.color ?? "";
            colors.push(color);
          }
          const color = colors.find(x => x.colorCode === colorBox?.color)
          // width * # of pieces * lpr
          const inches = (this.pattern.widthInReed * (this.patternForm.controls['pieces'].value ?? 1) * this.pattern.lpr) ?? 0;
          color.colorInches += inches;
          weftIn += inches;
        }
      });

      // width pattern repeats
      this.pattern.wpr = 1;
      const selvedge = (this.patternForm.controls['selvedgeWidth'].value > 0 ? this.patternForm.controls['selvedgeWidth'].value * 2 : 0);
      if (this.patternForm.controls['patternWidth'].value > 0) {
        // (width * epi) / pattern width
        this.pattern.wpr = ((this.pattern.widthInReedNoFringe - selvedge)  * this.pattern.epi!) / this.patternForm.controls['patternWidth'].value;
      } else {
        this.pattern.patternWidth = Math.round((this.pattern.widthInReedNoFringe - selvedge) * this.pattern.epi!);
      }
      // warp threads
      this.pattern.threadingBoxes?.forEach(warp => {
        if (warp.selected) {
          const colorBox = this.pattern.colorBoxes[0]?.find(x => x.x == warp.x);
          if (!colors.map(x => x.colorCode).find(x => x === colorBox?.color)) {
            const color = new Yarn();
            color.colorCode = colorBox?.color ?? "";
            colors.push(color);
          }
          const color = colors.find(x => x.colorCode === colorBox?.color)
          // length * wpr
          const inches = (this.pattern.lengthOnLoom * this.pattern.wpr) ?? 0;
          color.colorInches += inches;
          warpIn += inches;
        }
      });
      // if color isn't already in saved colors, add it
      colors?.forEach(color => {
        const patternColor = this.pattern.colors.find(x => x.colorCode === color.colorCode);
        if (!patternColor) {
          this.pattern.colors.push(color);
        }
      });
      this.pattern.colors.forEach(color => {
        const patternColor = colors.find(c => c.colorCode === color.colorCode);
        if (patternColor && patternColor.colorInches > 0) {
          color.colorInches = patternColor.colorInches;
          color.colorYds = Math.ceil(color.colorInches / 36);
          this.calculatePrice(color.colorCode);
        } else {
          this.pattern.colors = this.pattern.colors.filter(x => x.colorCode !== color.colorCode);
        }
      });
      this.pattern.warpYds = Math.ceil(warpIn / 36);
      this.pattern.weftYds = Math.ceil(weftIn / 36);
      this.pattern.totalYds = this.pattern.warpYds + this.pattern.weftYds;
    }
  }

  settCalcUpdated() {
    if (this.settForm.controls['ypp'].value > 0 && this.settForm.controls['yarnType'].value !== null) {
      const multiplier = this.settForm.controls['yarnType'].value === "firm" ? .9 : .84;
      this.ashenhurst = Math.sqrt(this.settForm.controls['ypp'].value) * multiplier;
      if (this.settForm.controls['density'].value > 0) {
        this.settSelected();
      }
    }
  }

  settSelected() {
    this.settForm.controls['sett'].setValue(Math.round(this.settForm.controls['density'].value * this.ashenhurst));
  }

  onSettSubmit() {
    if (this.editing === "ends per inch") {
      this.pattern.epi = this.settForm.controls['sett'].value;
      this.epiChanged();
    } else {
      this.pattern.ppi = this.settForm.controls['sett'].value;
    }
    this.modalService.dismissAll();
  }

  updateFromSample(direction: string, percentage: string) {
    const takeUpWidth = this.patternForm.controls['sampleOffLoomWidth'].value;
    const shrinkageWidth = this.patternForm.controls['sampleAfterWashWidth'].value;
    const widthInReedNoFringe = this.pattern.widthInReedNoFringe;
    const takeUpLength = this.patternForm.controls['sampleOffLoomLength'].value;
    const shrinkageLength = this.patternForm.controls['sampleAfterWashLength'].value;
    const sampleLength = this.patternForm.controls['sampleLength'].value;
    // TODO: update finished dimensions instead of in-loom dimensions
    if (direction === "warp") {
      if (percentage === "take-up") {
        this.pattern.calculatedWarpTakeUp = +(((sampleLength - takeUpLength)/sampleLength)*100).toFixed(2);
      } else {
        this.pattern.calculatedWarpShrinkage = +(((takeUpLength - shrinkageLength)/takeUpLength)*100).toFixed(2);
      }
    } else {
      if (percentage === "take-up") {
        this.pattern.calculatedWeftTakeUp = +(((widthInReedNoFringe - takeUpWidth)/widthInReedNoFringe)*100).toFixed(2);
      } else {
        this.pattern.calculatedWeftShrinkage = +(((takeUpWidth - shrinkageWidth)/takeUpWidth)*100).toFixed(2);
      }
    }
  }

  saveYarn(direction: string) {
    
  }
  
  open(content: any, editing: string = "") {
    this.editing = editing;
    if (editing === "ends per inch") {
      this.settForm.controls['sett'].setValue(this.pattern.epi ?? null);
    } else if (editing === "picks per inch") {
      this.settForm.controls['sett'].setValue(this.pattern.ppi ?? null);
    }
    this.modalService.open(content).result.then((result) => {
      if (editing !== "") {
        this.editing = "";
        this.settForm.reset();
      }
    }, (reason) => {
      if (editing !== "") {
        this.editing = "";
        this.settForm.reset();
      }
    });
  }
}

