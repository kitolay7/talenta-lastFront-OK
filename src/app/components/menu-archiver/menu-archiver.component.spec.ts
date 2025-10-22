import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuArchiverComponent } from './menu-archiver.component';

describe('MenuArchiverComponent', () => {
  let component: MenuArchiverComponent;
  let fixture: ComponentFixture<MenuArchiverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuArchiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuArchiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
