import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {

  name: string;
  shafts: number;
  treadles: number;
  epi: number;
  workingWidth: number;
  selvageWidth: number;
  waste: number;
  trompAsWrit: boolean;

  constructor() {
    this.name = "";
    this.shafts = 4;
    this.treadles = 6;
    this.epi = 6;
    this.workingWidth = 6;
    this.selvageWidth = 6;
    this.waste = 6;
    this.trompAsWrit = false;
  }

  ngOnInit(): void {
  }
}
