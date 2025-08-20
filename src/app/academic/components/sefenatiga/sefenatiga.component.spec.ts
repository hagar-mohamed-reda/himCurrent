/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SefenatigaComponent } from './sefenatiga.component';

describe('SefenatigaComponent', () => {
  let component: SefenatigaComponent;
  let fixture: ComponentFixture<SefenatigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SefenatigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SefenatigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
