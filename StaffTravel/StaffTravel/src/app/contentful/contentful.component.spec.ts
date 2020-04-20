import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentfulComponent } from './contentful.component';

describe('ContentfulComponent', () => {
  let component: ContentfulComponent;
  let fixture: ComponentFixture<ContentfulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentfulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
