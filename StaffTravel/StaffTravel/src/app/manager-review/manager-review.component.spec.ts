import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewComponent } from './manager-review.component';

describe('ManagerReviewComponent', () => {
  let component: ManagerReviewComponent;
  let fixture: ComponentFixture<ManagerReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
