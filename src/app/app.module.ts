import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataCollectorComponent } from './data-collector/data-collector.component';
import { WarpDesignerComponent } from './warp-designer/warp-designer.component';
import { PatternDesignerComponent } from './pattern-designer/pattern-designer.component';
import { PatternVisualizerComponent } from './pattern-visualizer/pattern-visualizer.component';
import { WeftDesignerComponent } from './weft-designer/weft-designer.component';

@NgModule({
  declarations: [
    AppComponent,
    DataCollectorComponent,
    WarpDesignerComponent,
    PatternDesignerComponent,
    PatternVisualizerComponent,
    WeftDesignerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
