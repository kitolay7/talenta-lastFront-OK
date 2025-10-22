import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFormRecruteurComponent } from './profile-form-recruteur.component';

describe('ProfileFormRecruteurComponent', () => {
  let component: ProfileFormRecruteurComponent;
  let fixture: ComponentFixture<ProfileFormRecruteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFormRecruteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
