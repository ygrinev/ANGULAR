import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsNavComponent } from './requests-nav.component';

describe('RequestsNavComponent', () => {
  let component: RequestsNavComponent;
  let fixture: ComponentFixture<RequestsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
