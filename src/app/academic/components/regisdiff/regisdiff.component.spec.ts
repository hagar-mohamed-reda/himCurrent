/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegisdiffComponent } from './regisdiff.component';

describe('RegisdiffComponent', () => {
  let component: RegisdiffComponent;
  let fixture: ComponentFixture<RegisdiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisdiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisdiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
