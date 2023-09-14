/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GpacalcComponent } from './gpacalc.component';

describe('GpacalcComponent', () => {
  let component: GpacalcComponent;
  let fixture: ComponentFixture<GpacalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpacalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpacalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
