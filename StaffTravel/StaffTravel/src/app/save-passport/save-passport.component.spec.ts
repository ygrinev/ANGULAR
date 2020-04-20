import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePassportComponent } from './save-passport.component';

describe('SavePassportComponent', () => {
  let component: SavePassportComponent;
  let fixture: ComponentFixture<SavePassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
