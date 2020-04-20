import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllRequestsComponent } from './list-of-all-requests.component';

describe('ListOfAllRequestsComponent', () => {
  let component: ListOfAllRequestsComponent;
  let fixture: ComponentFixture<ListOfAllRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfAllRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAllRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
