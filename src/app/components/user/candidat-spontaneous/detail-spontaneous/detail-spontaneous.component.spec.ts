import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSpontaneousComponent } from './detail-spontaneous.component';

describe('DetailSpontaneousComponent', () => {
  let component: DetailSpontaneousComponent;
  let fixture: ComponentFixture<DetailSpontaneousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSpontaneousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSpontaneousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
