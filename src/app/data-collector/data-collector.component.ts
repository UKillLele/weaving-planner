import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {

  @Output() shaftsEvent = new EventEmitter<number>();
  @Output() treadlesEvent = new EventEmitter<number>();
  @Output() patternLengthEvent = new EventEmitter<number>();
  @Output() trompEvent = new EventEmitter<boolean>();
  @Output() epiEvent = new EventEmitter<number>();
  @Output() workingWidthEvent = new EventEmitter<number>();

  name: string;
  shafts?: number;
  treadles?: number;
  epi?: number;
  workingWidth?: number;
  selvageWidth?: number;
  waste?: number;
  trompAsWrit: boolean;
  edgeType: string;
  edgeLength?: number;
  pieces?: number;
  patternWidth?: number;
  warpMaterial: string;
  warpDrawIn?: number;
  warpShrinkage?: number;
  ppi?: number;
  workingLength?: number;
  patternLength?: number;
  weftMaterial: string;
  weftDrawIn?: number;
  weftShrinkage?: number;

  constructor() {
    this.name = "";
    this.trompAsWrit = false;
    this.edgeType = "fringe";
    this.warpMaterial = "cotton";
    this.weftMaterial = "cotton";
  }

  ngOnInit(): void {
  }

  toggleTromp() {
    if (this.trompAsWrit) {
      this.patternLength = this.patternWidth;
      this.ppi = this.epi;
    }
  }

  shaftsChanged() {
    this.shaftsEvent.emit(this.shafts);
  }
  treadlesChanged() {
    this.treadlesEvent.emit(this.treadles);
  }
  trompChanged() {
    this.trompEvent.emit(this.trompAsWrit);
  }
  patternLengthChanged() {
    this.patternLengthEvent.emit(this.patternLength);
  }
  epiChanged() {
    this.epiEvent.emit(this.epi);
  }
  workingWidthChanged() {
    this.workingWidthEvent.emit(this.workingWidth);
  }
}
