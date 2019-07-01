/* angular */
import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Http } from '@angular/http';
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
  MatSnackBarModule,
  MatCard
} from '@angular/material';

/* 3rd party */

/* application */

export interface Option {
  id: number;
  name: string;
  country: string;
  coord: {
    lon: number;
    lat: number
  };
}

@Component({
  selector: 'mat-cards-lazy-list',
  templateUrl: './mat-cards-lazy-list.component.html',
  styleUrls: ['./mat-cards-lazy-list.component.scss'],
  providers: []
})

export class MatCardsLazyListComponent implements AfterViewInit {

  // public throttle = 300;
  // public scrollDistance = 1;
  // public scrollUpDistance = 2;
  tt = 2;
  array = [];
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;

  constructor() {}
  ngAfterViewInit() {
  }

  scrollDown() {

  }

  scrollUp() {

  }
}
