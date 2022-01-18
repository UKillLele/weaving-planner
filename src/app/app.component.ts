import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { WeavingService } from 'src/services/weaving.service';
import { UserInfo } from 'src/models/user-info';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  treadles: number = 0;
  patternWidth: number = 0;
  boxWidth: number = 0;
  leftCol: number = 0;
  rightCol: number = 0;
  internalWidth: number = 0;

  @ViewChild('previewDialog') previewDialog!: TemplateRef<any>;

  constructor(
    private weavingService: WeavingService,
    private scrollDispatcher: ScrollDispatcher,
    private modalService: NgbModal
    ) { }

  userInfo?: UserInfo;

  async ngOnInit() {
    this.userInfo = await this.getUserInfo();
    this.weavingService.changePreviewAvailable(true);
    this.weavingService.patternWidth.subscribe((patternWidth: number) => {
      this.patternWidth = patternWidth;
      this.getWidth();
    });
    this.weavingService.treadles.subscribe((treadles: number) => {this.updateTreadles(treadles)});
    this.weavingService.internalWidth.subscribe((internalWidth: number) => {this.internalWidth = internalWidth});
  }

  async getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

  ngAfterViewInit(): void {
    this.scrollDispatcher.scrolled().subscribe(scrollable => {
      if (scrollable) this.onScroll(scrollable);
    });
  }

  onScroll(scrollable: CdkScrollable) {
    const right = scrollable.measureScrollOffset('right');
    Array.from(this.scrollDispatcher.scrollContainers.keys())
      .filter(otherScrollable => otherScrollable && otherScrollable !== scrollable)
      .forEach(otherScrollable => {
        if (otherScrollable.measureScrollOffset('right') !== right) {
          otherScrollable.scrollTo({right});
        }
      });
  }

  updateTreadles(treadles: number) {
    this.treadles = treadles;
    this.boxWidth = (1/(65+this.treadles))*100;
    this.weavingService.changeBoxWidth(this.boxWidth);
    this.leftCol = 64 * this.boxWidth;
    this.rightCol = (this.treadles +1) * this.boxWidth;
  }

  getWidth() {
    if (this.patternWidth) {
      this.weavingService.changeInternalWidth(this.boxWidth * this.patternWidth);
    }
  }
  
  open(content: any) {
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}