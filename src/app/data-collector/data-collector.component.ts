import { Component, OnInit } from '@angular/core';
import { WeavingService } from 'src/services/weaving.service';

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

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.shafts.subscribe((shafts: number) => this.shafts = shafts);
    this.weavingService.treadles.subscribe((treadles: number) => this.treadles = treadles);
    this.weavingService.trompAsWrit.subscribe((trompAsWrit: boolean) => this.trompAsWrit = trompAsWrit);
    this.weavingService.patternLength.subscribe((patternLength: number) => this.patternLength = patternLength);
    this.weavingService.epi.subscribe((epi: number) => this.epi = epi);
    this.weavingService.workingWidth.subscribe((workingWidth: number) => this.workingWidth = workingWidth);
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
  patternLengthChanged() {
    this.weavingService.changePatternLength(this.patternLength);
  }
  epiChanged() {
    this.weavingService.changeEpi(this.epi);
  }
  workingWidthChanged() {
    this.weavingService.changeWorkingWidth(this.workingWidth);
  }
}
