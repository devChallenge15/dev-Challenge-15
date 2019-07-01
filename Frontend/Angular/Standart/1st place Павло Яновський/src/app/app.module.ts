/* angular */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatTooltipModule,
  MatInputModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatDialogModule,
  MatGridListModule,
  MatCardModule,
  MatSnackBarModule
} from '@angular/material';

/* 3rd party */
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/* application */
import { AppComponent } from './app.component';
import { MatCardsLazyListModule } from './mat-cards-lazy-list/mat-cards-lazy-list.module'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSnackBarModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardsLazyListModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    // InfiniteScrollModule
  ],
  providers: [],
  exports: [MatCardsLazyListModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
