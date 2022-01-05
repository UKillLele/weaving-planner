import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataCollectorComponent } from './data-collector/data-collector.component';
import { PatternVisualizerComponent } from './pattern-visualizer/pattern-visualizer.component';
import { ThreadingPlannerComponent } from './threading-planner/threading-planner.component';
import { TieUpPlannerComponent } from './tie-up-planner/tie-up-planner.component';
import { TreadlingPlannerComponent } from './treadling-planner/treadling-planner.component';
import { ColorPlannerComponent } from './color-planner/color-planner.component';
import { PaletteComponent } from './palette/palette.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgCeilPipeModule } from 'angular-pipes';
import { NgxColorsModule } from 'ngx-colors';


@NgModule({
  declarations: [
    AppComponent,
    DataCollectorComponent,
    PatternVisualizerComponent,
    ThreadingPlannerComponent,
    TieUpPlannerComponent,
    TreadlingPlannerComponent,
    ColorPlannerComponent,
    PaletteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ScrollingModule,
    NgxColorsModule,
    NgCeilPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
