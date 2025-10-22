import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCandidatComponent } from './registration-candidat.component';

describe('RegistrationCandidatComponent', () => {
  let component: RegistrationCandidatComponent;
  let fixture: ComponentFixture<RegistrationCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
