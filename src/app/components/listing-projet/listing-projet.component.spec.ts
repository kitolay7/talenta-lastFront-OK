import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingProjetComponent } from './listing-projet.component';

describe('ListingProjetComponent', () => {
  let component: ListingProjetComponent;
  let fixture: ComponentFixture<ListingProjetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingProjetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
