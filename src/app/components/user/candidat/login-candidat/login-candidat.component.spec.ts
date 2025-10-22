import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCandidatComponent } from './login-candidat.component';

describe('LoginCandidatComponent', () => {
  let component: LoginCandidatComponent;
  let fixture: ComponentFixture<LoginCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
