/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArmyreportComponent } from './armyreport.component';

describe('ArmyreportComponent', () => {
  let component: ArmyreportComponent;
  let fixture: ComponentFixture<ArmyreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmyreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmyreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
