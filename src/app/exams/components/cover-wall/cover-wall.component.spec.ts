/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoverWallComponent } from './cover-wall.component';

describe('CoverWallComponent', () => {
  let component: CoverWallComponent;
  let fixture: ComponentFixture<CoverWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
