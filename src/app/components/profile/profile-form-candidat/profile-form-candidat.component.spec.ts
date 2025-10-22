import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFormCandidatComponent } from './profile-form-candidat.component';

describe('ProfileFormCandidatComponent', () => {
  let component: ProfileFormCandidatComponent;
  let fixture: ComponentFixture<ProfileFormCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFormCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
