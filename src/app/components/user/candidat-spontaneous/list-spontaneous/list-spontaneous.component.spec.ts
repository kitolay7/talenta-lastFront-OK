import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpontaneousComponent } from './list-spontaneous.component';

describe('ListSpontaneousComponent', () => {
  let component: ListSpontaneousComponent;
  let fixture: ComponentFixture<ListSpontaneousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSpontaneousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSpontaneousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
