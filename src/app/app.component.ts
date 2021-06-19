import { Component, OnInit } from '@angular/core';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  treadles: number = 0;
  epi: number = 0;
  workingWidth: number = 0;
  warp: number = 0;
  leftCol: number = 0;;
  rightCol: number = 0;;
  internalWidth: number = 0;

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.warp.subscribe((warp: number) => {this.warp = warp});
    this.weavingService.treadles.subscribe((treadles: number) => {this.updateTreadles(treadles)});
    this.weavingService.leftCol.subscribe((leftCol: number) => {this.leftCol = leftCol});
    this.weavingService.rightCol.subscribe((rightCol: number) => {this.rightCol = rightCol});
    this.weavingService.internalWidth.subscribe((internalWidth: number) => {this.internalWidth = internalWidth});
    this.weavingService.epi.subscribe((epi: number) => {this.updateEpi(epi)});
    this.weavingService.workingWidth.subscribe((workingWidth: number) => {this.updateWorkingWidth(workingWidth)});
  }

  updateTreadles(treadles: number) {
    this.treadles = treadles;
    this.weavingService.changeLeftCol((64 / (64 + this.treadles)) * 100);
    this.weavingService.changeRightCol((this.treadles / (64 + this.treadles)) * 100);
  }
  updateEpi(epi: number) {
    this.epi = epi;
    this.getWarp();
  }
  updateWorkingWidth(workingWidth: number) {
    this.workingWidth = workingWidth;
    this.getWarp();
  }

  getWarp() {
    console.log('getting warp')
    if (this.epi != 0 && this.workingWidth != 0) {
      this.weavingService.changeWarp(this.epi * this.workingWidth);
      this.weavingService.changeInternalWidth((((this.rightCol/this.treadles) * this.warp)/this.leftCol) * 100);
    }
  }
}