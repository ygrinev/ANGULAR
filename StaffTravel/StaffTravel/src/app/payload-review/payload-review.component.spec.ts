import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayloadReviewComponent } from './payload-review.component';

describe('PayloadReviewComponent', () => {
  let component: PayloadReviewComponent;
  let fixture: ComponentFixture<PayloadReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayloadReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayloadReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
