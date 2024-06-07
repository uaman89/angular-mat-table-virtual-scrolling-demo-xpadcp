import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'table-scrolling-viewport',
  templateUrl: './table-scrolling-viewport.component.html',
  styleUrls: ['./table-scrolling-viewport.component.css']
})
export class TableScrollingViewportComponent implements OnInit, OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemSize: number = 0;
  @Output() itemsRangeChange = new EventEmitter<ListRange>();

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  cdkViewport: CdkVirtualScrollViewport;

  virtualItems: undefined[] = [];

  offset = '0';

  constructor() { }

  ngOnInit() {
    // const el = this.cdkViewport.elementRef.nativeElement;
    this.cdkViewport.renderedRangeStream.subscribe((range: ListRange) => {
      // this.offset = this.cdkViewport.getOffsetToRenderedContentStart();
      // // el.style.setProperty('--offset', `-${this.offset}px`);
      // console.log('set offset:', this.offset);
      this.itemsRangeChange.emit(range);
    });

    // mutation observer
    const targetNode = this.cdkViewport._contentWrapper.nativeElement;
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
          if (mutation.attributeName === 'style') {
            const matched = targetNode.style.transform.match(/translateY\((.+)\)/);
            this.offset = matched[1] || '0';
            this.cdkViewport.elementRef.nativeElement.style.setProperty('--offset', `-${this.offset}`);
          }
        }
      }
    });
    // Start observing the target node for configured mutations
    observer.observe(targetNode, { attributes: true });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems']) {
      this.virtualItems = Array.from({ length: this.totalItems });
      this.cdkViewport.checkViewportSize();
    }
  }

}
