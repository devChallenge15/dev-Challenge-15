import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardsLazyListModule} from './mat-cards-lazy-list';
import {MaterialModule} from './material';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatCardsLazyListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
