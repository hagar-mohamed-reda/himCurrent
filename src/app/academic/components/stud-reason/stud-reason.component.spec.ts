/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudReasonComponent } from './stud-reason.component';

describe('StudReasonComponent', () => {
  let component: StudReasonComponent;
  let fixture: ComponentFixture<StudReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
