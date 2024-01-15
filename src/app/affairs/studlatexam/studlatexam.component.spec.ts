/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudlatexamComponent } from './studlatexam.component';

describe('StudlatexamComponent', () => {
  let component: StudlatexamComponent;
  let fixture: ComponentFixture<StudlatexamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudlatexamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudlatexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
