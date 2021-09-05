import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WeavingService } from 'src/services/weaving.service';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit {
  colorPalette: string[] = [];
  selectedColor: string = '';
  selectedIndex: number = -1;
  edit: boolean = false;
  remove: boolean = false;
  previewAvailable: boolean = false;

  @Output() previewEvent = new EventEmitter<any>();

  constructor(private weavingService: WeavingService) { }

  ngOnInit(): void {
    this.weavingService.previewAvailable.subscribe(previewAvailable => this.previewAvailable = previewAvailable);
    this.weavingService.colorPalette.subscribe(colorPalette => this.colorPalette = colorPalette);
    this.weavingService.selectedColor.subscribe(selectedColor => this.selectedColor = selectedColor);
  }

  selectOrDelete(index: number) {
    if (this.remove)
      this.colorPalette.splice(index, 1);
    else
    {
      this.selectedColor = this.colorPalette[index];
      this.selectedIndex = index;
    }
  }

  addToPalette(){
    this.colorPalette.push("#f0f0f0");
    this.selectedIndex = this.colorPalette.length -1;
  }

  toggleRemove() {
    this.remove = !this.remove;
    this.selectedIndex = -1;
    this.selectedColor = "";
  }

  selectedColorChanged() {
    this.selectedColor = this.colorPalette[this.selectedIndex];
    this.weavingService.changeSelectedColor(this.selectedColor);
  }

  openPreview() {
    this.previewEvent.emit();   
  }
}
