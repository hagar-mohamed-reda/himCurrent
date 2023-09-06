/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingresultComponent } from './settingresult.component';

describe('SettingresultComponent', () => {
  let component: SettingresultComponent;
  let fixture: ComponentFixture<SettingresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
