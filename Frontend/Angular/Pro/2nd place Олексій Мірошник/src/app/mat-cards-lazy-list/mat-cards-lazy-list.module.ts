import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardsLazyListComponent} from './mat-cards-lazy-list.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {MaterialModule} from '../material';
import {MatCardsLazyListItemDirective} from './mat-cards-lazy-list-item/mat-cards-lazy-list-item.directive';
import {MatCardLazyListScrollUpDirective} from './mat-cards-lazy-list-scroll-up/mat-card-lazy-list-scroll-up.directive';

@NgModule({
  declarations: [
    MatCardsLazyListComponent,
    MatCardsLazyListItemDirective,
    MatCardLazyListScrollUpDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    InfiniteScrollModule,
  ],
  exports: [
    MatCardsLazyListComponent,
    MatCardsLazyListItemDirective,
    MatCardLazyListScrollUpDirective,
  ],
})
export class MatCardsLazyListModule {
}
