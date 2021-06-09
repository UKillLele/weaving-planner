import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataCollectorComponent } from './data-collector/data-collector.component';
import { PatternVisualizerComponent } from './pattern-visualizer/pattern-visualizer.component';
import { ThreadingPlannerComponent } from './threading-planner/threading-planner.component';
import { TieUpPlannerComponent } from './tie-up-planner/tie-up-planner.component';
import { TreadlingPlannerComponent } from './treadling-planner/treadling-planner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    DataCollectorComponent,
    PatternVisualizerComponent,
    ThreadingPlannerComponent,
    TieUpPlannerComponent,
    TreadlingPlannerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
