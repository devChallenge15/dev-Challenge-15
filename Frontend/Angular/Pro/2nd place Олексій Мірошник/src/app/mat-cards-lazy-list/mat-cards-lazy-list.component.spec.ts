import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatCardsLazyListComponent} from './mat-cards-lazy-list.component';

describe('MatCardsLazyListComponent', () => {
  let component: MatCardsLazyListComponent;
  let fixture: ComponentFixture<MatCardsLazyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatCardsLazyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatCardsLazyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
