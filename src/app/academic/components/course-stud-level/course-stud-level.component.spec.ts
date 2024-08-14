/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseStudLevelComponent } from './course-stud-level.component';

describe('CourseStudLevelComponent', () => {
  let component: CourseStudLevelComponent;
  let fixture: ComponentFixture<CourseStudLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseStudLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStudLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
