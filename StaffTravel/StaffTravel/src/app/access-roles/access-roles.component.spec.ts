import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRolesComponent } from './access-roles.component';

describe('AccessRolesComponent', () => {
  let component: AccessRolesComponent;
  let fixture: ComponentFixture<AccessRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
