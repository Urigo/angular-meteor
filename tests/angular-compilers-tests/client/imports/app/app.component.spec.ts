import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/mocha-patch';
import 'core-js/es7/reflect';

import { getTestBed, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';
import { spy } from 'sinon';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe(`AppComponent`, () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
          declarations: [AppComponent] //declare test component
        })
        .compileComponents(); //compile html and css
    }));

    afterEach(() => {
      getTestBed().resetTestingModule();
    });

    it('should display 0 as initial value', () => {
      const fixture = TestBed.createComponent(AppComponent);

      fixture.detectChanges();

      const h2 = fixture.debugElement.query(By.css('h2'));

      expect(h2.nativeElement.textContent).to.equal('Value: 0');
    });

    it('should increment the value', () => {
      const fixture = TestBed.createComponent(AppComponent);

      fixture.componentInstance.onIncrementClick();

      fixture.detectChanges();

      const h2 = fixture.debugElement.query(By.css('h2'));

      expect(h2.nativeElement.textContent).to.equal('Value: 1');
    });

    it('should invoke onIncrementClick when the user clicks the increment button', () => {
      const fixture = TestBed.createComponent(AppComponent);

      const onIncrementClick = spy(fixture.componentInstance, 'onIncrementClick');

      const button = fixture.debugElement.query(By.css('.increment'));

      button.triggerEventHandler('click', {});

      expect(onIncrementClick.called).to.equal(true);
    });

    it('should render styles correctly', () => {
      const fixture = TestBed.createComponent(AppComponent);

      fixture.detectChanges();

      const h2 = fixture.debugElement.query(By.css('h2'));

      const {
        fontSize,
        color
      } = getComputedStyle(h2.nativeElement);

      expect(fontSize).to.equal('32px');

      expect(color).to.equal('rgb(0, 255, 0)');

    });

});
