/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReporttagnedComponent } from './reporttagned.component';

describe('ReporttagnedComponent', () => {
  let component: ReporttagnedComponent;
  let fixture: ComponentFixture<ReporttagnedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporttagnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporttagnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
