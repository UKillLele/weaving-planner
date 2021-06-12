import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pattern-visualizer',
  templateUrl: './pattern-visualizer.component.html',
  styleUrls: ['./pattern-visualizer.component.scss']
})
export class PatternVisualizerComponent implements OnInit {
  @Input() patternLength?: number;
  @Input() patternWidth?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
