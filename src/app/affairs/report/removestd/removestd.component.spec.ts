/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RemovestdComponent } from './removestd.component';

describe('RemovestdComponent', () => {
  let component: RemovestdComponent;
  let fixture: ComponentFixture<RemovestdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovestdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovestdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
