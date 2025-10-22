import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanqueCvComponent } from './banque-cv.component';

describe('BanqueCvComponent', () => {
  let component: BanqueCvComponent;
  let fixture: ComponentFixture<BanqueCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanqueCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanqueCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
