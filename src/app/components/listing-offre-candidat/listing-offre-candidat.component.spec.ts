import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingOffreCandidatComponent } from './listing-offre-candidat.component';

describe('ListingOffreCandidatComponent', () => {
  let component: ListingOffreCandidatComponent;
  let fixture: ComponentFixture<ListingOffreCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingOffreCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingOffreCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
