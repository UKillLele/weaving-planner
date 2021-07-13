import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  treadles: number = 0;
  epi: number = 0;
  workingWidth: number = 0;
  warp: number = 0;
  boxWidth: number = 0;
  leftCol: number = 0;
  rightCol: number = 0;
  internalWidth: number = 0;

  constructor(
    private weavingService: WeavingService,
    private scrollDispatcher: ScrollDispatcher
    ) { }

  ngOnInit(): void {
    this.weavingService.warp.subscribe((warp: number) => {this.warp = warp});
    this.weavingService.treadles.subscribe((treadles: number) => {this.updateTreadles(treadles)});
    this.weavingService.internalWidth.subscribe((internalWidth: number) => {this.internalWidth = internalWidth});
    this.weavingService.epi.subscribe((epi: number) => {this.updateEpi(epi)});
    this.weavingService.workingWidth.subscribe((workingWidth: number) => {this.updateWorkingWidth(workingWidth)});
  }

  ngAfterViewInit(): void {
    this.scrollDispatcher.scrolled().subscribe(scrollable => {
      if (scrollable) this.onScroll(scrollable);
    });
  }

  onScroll(scrollable: CdkScrollable) {
    const right = scrollable.measureScrollOffset('right');
    Array.from(this.scrollDispatcher.scrollContainers.keys())
      .filter(otherScrollable => otherScrollable && otherScrollable !== scrollable)
      .forEach(otherScrollable => {
        if (otherScrollable.measureScrollOffset('right') !== right) {
          otherScrollable.scrollTo({right});
        }
      });
  }

  updateTreadles(treadles: number) {
    this.treadles = treadles;
    this.boxWidth = (1/(65+this.treadles))*100;
    this.weavingService.changeBoxWidth(this.boxWidth);
    this.leftCol = 64 * this.boxWidth;
    this.rightCol = (this.treadles +1) * this.boxWidth;
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
    if (this.epi != 0 && this.workingWidth != 0) {
      this.weavingService.changeWarp(this.epi * this.workingWidth);
      this.weavingService.changeInternalWidth(((this.boxWidth * this.warp)/this.leftCol) * 100);
    }
  }
}