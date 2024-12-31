/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoverSignsComponent } from './cover-signs.component';

describe('CoverSignsComponent', () => {
  let component: CoverSignsComponent;
  let fixture: ComponentFixture<CoverSignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverSignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverSignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
