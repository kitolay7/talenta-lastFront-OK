import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCandidatComponent } from './detail-candidat.component';

describe('DetailCandidatComponent', () => {
  let component: DetailCandidatComponent;
  let fixture: ComponentFixture<DetailCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
