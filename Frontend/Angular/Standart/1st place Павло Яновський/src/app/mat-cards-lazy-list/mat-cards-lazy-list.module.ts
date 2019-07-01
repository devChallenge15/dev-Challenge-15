/* angular */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    ScrollingModule,
    ScrollDispatcher
} from '@angular/cdk/scrolling'

/* 3rd party */
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/* application */
import { MatCardsLazyListComponent } from './mat-cards-lazy-list.component';

const routes: Routes = [
  {
    path: '',
    component: MatCardsLazyListComponent,
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
    //   ScrollingModule,
      InfiniteScrollModule
    ],
  exports: [RouterModule, MatCardsLazyListComponent],
  declarations: [MatCardsLazyListComponent],
  providers: [ScrollDispatcher]
})
export class MatCardsLazyListModule {}
