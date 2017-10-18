import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';
import 'core-js/es7/reflect';

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppComponent } from './imports/app/app.component';

// This should only be called once.
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('AppComponent (styles)', () => {

  let comp;
  let fixture;
  let de;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent], // declare the test component
    })
      .compileComponents();  // compile template and css;
  }))

  beforeEach(() => {

    fixture = TestBed.createComponent(AppComponent);

    comp = fixture.componentInstance; // AppComponent test instance

    // query for the title <p class="greeting"> by CSS element selector
    de = fixture.debugElement.query(By.css('p.greeting'));
    el = de.nativeElement;
    
  });
  it('should render styles correctly', () => {
    fixture.detectChanges();
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.fontSize).toEqual('32px');
    expect(computedStyle.color).toEqual('rgb(0, 128, 0)');
  });
  it('should render template correctly', () => {
    fixture.detectChanges();
    expect(el.innerHTML).toEqual('Hello World!');
  })
});
