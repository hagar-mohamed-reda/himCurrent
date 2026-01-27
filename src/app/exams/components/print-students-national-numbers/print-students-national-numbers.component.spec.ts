/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrintStudentsNationalNumbersComponent } from './print-students-national-numbers.component';

describe('PrintStudentsNationalNumbersComponent', () => {
  let component: PrintStudentsNationalNumbersComponent;
  let fixture: ComponentFixture<PrintStudentsNationalNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintStudentsNationalNumbersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStudentsNationalNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
