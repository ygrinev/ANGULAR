import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestsComponent } from './team-requests.component';

describe('TeamRequestsComponent', () => {
  let component: TeamRequestsComponent;
  let fixture: ComponentFixture<TeamRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
