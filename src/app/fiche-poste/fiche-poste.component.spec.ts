import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePosteComponent } from './fiche-poste.component';

describe('FichePosteComponent', () => {
  let component: FichePosteComponent;
  let fixture: ComponentFixture<FichePosteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichePosteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichePosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
