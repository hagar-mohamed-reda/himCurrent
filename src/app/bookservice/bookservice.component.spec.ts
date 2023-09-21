/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookserviceComponent } from './bookservice.component';

describe('BookserviceComponent', () => {
  let component: BookserviceComponent;
  let fixture: ComponentFixture<BookserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
