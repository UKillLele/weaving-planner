import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
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
  }

  toggleRemove() {
    this.remove = !this.remove;
    this.edit = false;
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.remove = false;
  }

}
