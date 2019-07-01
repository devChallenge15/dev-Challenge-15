import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EmbeddedViewRef,
  OnDestroy,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {MatCardsLazyListItemDirective} from './mat-cards-lazy-list-item/mat-cards-lazy-list-item.directive';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {InfiniteScrollEvent} from 'ngx-infinite-scroll';
import {MatCardLazyListScrollUpDirective} from './mat-cards-lazy-list-scroll-up/mat-card-lazy-list-scroll-up.directive';
import {throttle} from '../utils/throttle';

@Component({
  selector: 'app-mat-cards-lazy-list',
  templateUrl: './mat-cards-lazy-list.component.html',
  styleUrls: ['./mat-cards-lazy-list.component.scss'],
})
export class MatCardsLazyListComponent implements AfterContentInit, OnDestroy {

  @ViewChild('viewContainer', {read: ViewContainerRef, static: true})
  viewContainer: ViewContainerRef;

  @ViewChild('btnViewContainer', {read: ViewContainerRef, static: true})
  btnViewContainer: ViewContainerRef;

  @ContentChild(MatCardLazyListScrollUpDirective, {read: TemplateRef, static: true})
  scrollUpBtnTemplate: TemplateRef<any>;

  @ContentChildren(MatCardsLazyListItemDirective, {read: TemplateRef, descendants: true})
  matCardQueryList: QueryList<TemplateRef<any>>;

  matCardTemplateRefs: Array<TemplateRef<any>> = [];

  cursor = 0;

  constructor(private renderer: Renderer2) {
  }

  ngAfterContentInit(): void {
    this.matCardTemplateRefs = this.matCardQueryList.toArray();

    this.initOnChanges();

    this.renderFirstElements();

    this.attachBtn();
  }

  private attachBtn(): void {
    if (!this.scrollUpBtnTemplate) {
      return;
    }

    const view = this.createEmbeddedView(this.btnViewContainer, this.scrollUpBtnTemplate);

    const htmlElem = view && view.rootNodes && view.rootNodes[0];
    if (!htmlElem) {
      return;
    }

    this.renderer.setStyle(htmlElem, 'position', 'fixed');
    this.renderer.setStyle(htmlElem, 'bottom', '25px');
    this.renderer.setStyle(htmlElem, 'right', '25px');


    this.renderer.listen(htmlElem, 'click', () => {
      const scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, c - c / 16);
        }
      };
      scrollToTop();
    });

    const renderBtn = () => {
      const viewRef = this.viewContainer.get(0) as EmbeddedViewRef<any>;

      const offsetTop = this.getViewHTMLProp(viewRef, 'offsetTop');

      this.renderer.setStyle(htmlElem, 'visibility', offsetTop < window.scrollY ? 'visible' : 'hidden');
    };

    this.renderer.listen(window, 'scroll', throttle(renderBtn, 200));

    renderBtn();
  }

  private renderFirstElements<T>(): void {
    if (!this.matCardTemplateRefs) {
      return;
    }

    let totalHeight = 0;
    let checkFirst = false;
    for (const templateRef of this.matCardTemplateRefs) {
      if (totalHeight <= window.innerHeight && templateRef) {
        const view = this.createEmbeddedView(this.viewContainer, templateRef);
        totalHeight += this.getViewHTMLProp(view, 'clientHeight');
        if (!checkFirst) {
          checkFirst = true;
          totalHeight += this.getViewHTMLProp(view, 'offsetTop');
        }
        this.cursor++;
      } else {
        return;
      }
    }
  }

  private createEmbeddedView<T>(vc: ViewContainerRef, templateRef: TemplateRef<T>): EmbeddedViewRef<T> {
    return vc.createEmbeddedView(templateRef);
  }

  private initOnChanges(): void {
    this.matCardQueryList.changes
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.matCardTemplateRefs = this.matCardQueryList.toArray();
        this.viewContainer.clear();
        this.cursor = 0;
        this.renderFirstElements();
      });
  }

  private getViewHTMLProp<T>(embeddedViewRef: EmbeddedViewRef<T>, prop: string): any {
    const elem = embeddedViewRef && embeddedViewRef.rootNodes && embeddedViewRef.rootNodes[0];
    if (!!elem) {
      return (elem as any)[prop];
    }
    return null;
  }

  onScrollDown({currentScrollPosition}: InfiniteScrollEvent): void {
    const viewRef = this.viewContainer.get(this.cursor - 1) as EmbeddedViewRef<any>;

    const {offsetTop, clientHeight} = (viewRef.rootNodes[0] as HTMLElement);

    if ((offsetTop + clientHeight) <= currentScrollPosition) {
      this.createEmbeddedView(this.viewContainer, this.matCardTemplateRefs[this.cursor]);
    }
  }

  ngOnDestroy(): void {
  }
}
