import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-treadling-planner',
  templateUrl: './treadling-planner.component.html',
  styleUrls: ['./treadling-planner.component.scss']
})
export class TreadlingPlannerComponent implements OnInit {

  @Input() treadles?: number;
  @Input() patternLength?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
