import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {

  name: string;
  shafts: number;

  constructor() {
    this.shafts = 4;
    this.name = "";
  }

  ngOnInit(): void {
  }
}
