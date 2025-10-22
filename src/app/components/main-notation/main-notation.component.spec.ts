import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNotationComponent } from './main-notation.component';

describe('MainNotationComponent', () => {
  let component: MainNotationComponent;
  let fixture: ComponentFixture<MainNotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
