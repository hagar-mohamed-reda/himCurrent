/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EfadaComponent } from './efada.component';

describe('EfadaComponent', () => {
  let component: EfadaComponent;
  let fixture: ComponentFixture<EfadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
