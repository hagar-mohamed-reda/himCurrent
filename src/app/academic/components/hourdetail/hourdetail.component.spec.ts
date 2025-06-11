/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HourdetailComponent } from './hourdetail.component';

describe('HourdetailComponent', () => {
  let component: HourdetailComponent;
  let fixture: ComponentFixture<HourdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
