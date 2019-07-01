import {AfterViewInit, Component, ContentChild, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material';

@Component({
  selector: 'mat-cards-lazy-list',
  template: `
    <div class="lazy-list" #lazyList>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .lazy-list {
      min-height: calc(100vh + 50px);
      padding-top: 10px;
    }
  `]
})
export class MatCardsLazyListComponent implements AfterViewInit {
  @ViewChild('lazyList', {static: false}) lazyList!: ElementRef;
  @ContentChild('matCardLazyListScrollUp', {static: false}) scrollUpButton!: MatButton;

  listNodes: Array<HTMLElement> = [];
  startFromIndex = 0;
  isScrollUpButton = false;

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    this.listNodes = Array.from(this.lazyList.nativeElement.childNodes);

    this.isScrollUpButton = this.scrollUpButton && !!this.scrollUpButton._getHostElement;

    this.listNodes = this.listNodes
      .filter((el: HTMLElement) => {
        if (el && el.localName === 'mat-card') {
          return true;
        }
        this.renderer.removeChild(this.lazyList.nativeElement, el);
        return false;
      });

    this.listNodes.forEach((el, i) => {
      if (!this.ifInViewport(el)) {
        if (i !== this.startFromIndex) {
          this.renderer.removeChild(this.lazyList.nativeElement, el);
        } else {
          this.startFromIndex += 1;
        }
      }
    });

    this.renderer.listen('window', 'scroll', () => {

      const nextIndex = this.lazyList.nativeElement.childNodes.length;
      if (this.listNodes[nextIndex]) {
        if (this.ifInViewport(this.lazyList.nativeElement.childNodes[nextIndex - 1])) {
          this.renderer.appendChild(this.lazyList.nativeElement, this.listNodes[nextIndex]);
        }
      }

      if (this.isScrollUpButton) {
        if (!this.ifInViewport(this.lazyList.nativeElement.childNodes[0], true) &&
            !this.ifInViewport(this.scrollUpButton._getHostElement())) {
          this.insertScrollUpButton();
        } else if (this.ifInViewport(this.lazyList.nativeElement.childNodes[0], true) &&
          this.ifInViewport(this.scrollUpButton._getHostElement())) {
          this.renderer.removeChild(this.lazyList.nativeElement.parentNode, this.scrollUpButton._getHostElement());
        }
      }
    });

    if (this.isScrollUpButton) {
      this.attachButton();
    }
  }

  ifInViewport(el: HTMLElement, onlyTop = false): boolean {
    if (el && el.getBoundingClientRect) {
      const elRect = el.getBoundingClientRect();
      if (onlyTop) {
        return elRect.top > 0 && elRect.top <= window.innerHeight;
      }
      return elRect.bottom > 0 && elRect.bottom <= window.innerHeight;
    }
    return false;
  }

  attachButton() {
    if (this.scrollUpButton) {
      this.insertStyleScrollUpButton();

      this.renderer.listen(this.scrollUpButton._getHostElement(), 'click', () => {
        this.lazyList.nativeElement.scrollIntoView({behavior: 'smooth'});
      });
    }
  }

  insertScrollUpButton() {
    this.renderer.insertBefore(
      this.lazyList.nativeElement.parentNode,
      this.scrollUpButton._getHostElement(),
      this.lazyList.nativeElement
    );
  }

  insertStyleScrollUpButton() {
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'position', 'fixed');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'bottom', '20px');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'right', '20px');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'border-radius', '50%');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'width', '70px');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'height', '70px');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'border', '1px solid #ccc');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'background', '#fff');
    this.renderer.setStyle(this.scrollUpButton._getHostElement(), 'z-index', '2');
    this.renderer.setStyle(
      this.scrollUpButton._getHostElement(),
      'box-shadow',
      '-10px 10px 30px 0 rgba(93,107,150,.15)'
    );
  }
}
