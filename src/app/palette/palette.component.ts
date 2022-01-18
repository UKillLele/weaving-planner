import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  edit: boolean = true;
  previewAvailable: boolean = false;

  constructor(
    private weavingService: WeavingService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.weavingService.previewAvailable.subscribe(previewAvailable => this.previewAvailable = previewAvailable);
    this.weavingService.colorPalette.subscribe(colorPalette => this.colorPalette = colorPalette);
    this.weavingService.selectedColor.subscribe(selectedColor => this.selectedColor = selectedColor);
  }

  selectOrDelete(index: number) {
    if (!this.edit) {
      this.colorPalette.splice(index, 1);
      this.selectedColor = '';
      this.selectedIndex = -1;
      if (this.colorPalette.length === 0) this.edit = true;
    } else {
      this.selectedColor = this.colorPalette[index];
      this.selectedIndex = index;
    }
  }

  addToPalette(){
    if (!this.colorPalette) this.colorPalette = new Array<string>();
    this.colorPalette.push("#f0f0f0");
    this.selectedIndex = this.colorPalette.length -1;
  }

  toggleEditRemove()
 {
   this.edit = !this.edit;
 }

  selectedColorChanged() {
    this.selectedColor = this.colorPalette[this.selectedIndex];
    this.weavingService.changeSelectedColor(this.selectedColor);
  }
  
  open(content: any) {
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
