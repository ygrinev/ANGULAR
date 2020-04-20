import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFlightonlyRequestsComponent } from './all-flightonly-requests.component';

describe('AllFlightonlyRequestsComponent', () => {
  let component: AllFlightonlyRequestsComponent;
  let fixture: ComponentFixture<AllFlightonlyRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFlightonlyRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFlightonlyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
