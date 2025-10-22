import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationRecruteurComponent } from './registration-recruteur.component';

describe('RegistrationRecruteurComponent', () => {
  let component: RegistrationRecruteurComponent;
  let fixture: ComponentFixture<RegistrationRecruteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationRecruteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
