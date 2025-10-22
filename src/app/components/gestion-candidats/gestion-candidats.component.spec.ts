import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCandidatsComponent } from './gestion-candidats.component';

describe('GestionCandidatsComponent', () => {
  let component: GestionCandidatsComponent;
  let fixture: ComponentFixture<GestionCandidatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCandidatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCandidatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
