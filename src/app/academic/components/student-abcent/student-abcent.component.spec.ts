/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudentAbcentComponent } from './student-abcent.component';

describe('StudentAbcentComponent', () => {
  let component: StudentAbcentComponent;
  let fixture: ComponentFixture<StudentAbcentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAbcentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAbcentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
