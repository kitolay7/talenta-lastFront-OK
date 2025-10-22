import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOfferRecruteurComponent } from './detail-offer-recruteur.component';

describe('DetailOfferRecruteurComponent', () => {
  let component: DetailOfferRecruteurComponent;
  let fixture: ComponentFixture<DetailOfferRecruteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailOfferRecruteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOfferRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
