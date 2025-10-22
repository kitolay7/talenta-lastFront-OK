import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCandidatComponent } from './menu-candidat.component';

describe('MenuCandidatComponent', () => {
  let component: MenuCandidatComponent;
  let fixture: ComponentFixture<MenuCandidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCandidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
