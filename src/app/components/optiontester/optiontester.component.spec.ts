import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptiontesterComponent } from './optiontester.component';

describe('OptiontesterComponent', () => {
  let component: OptiontesterComponent;
  let fixture: ComponentFixture<OptiontesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptiontesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptiontesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
