import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements OnInit {
  selectedColors: string[] = [];
  selectedColor: string = '';
  tempColor: string = '#ffffff';
  tempColorIndex: number = -1;
  colorPickerOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  addColor() {
    this.selectedColors.push(this.tempColor);
    console.log(this.selectedColors);
  }

  removeColor(index: number) {
    this.selectedColors.splice(index, 1);
  }

  selectColor(color: string) {
    this.selectedColor = color;
    console.log(this.selectedColor);
  }

  openColorPicker(index: number) {
    this.tempColor = this.selectedColors[index];
    this.tempColorIndex = index;
    this.colorPickerOpen = true;
  }

  onChangeColor(color: string): void {
    this.selectedColors[this.tempColorIndex] = color;
    console.log(this.selectedColors)
  }

}
