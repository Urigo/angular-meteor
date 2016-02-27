/// <reference path="../../typings/angular2.d.ts" />
/// <reference path="../../typings/meteor/meteor.d.ts" />

import {Attribute, OnDestroy, Component, View, ElementRef} from 'angular2/core';

@Component({
  selector: 'accounts-ui'
})
@View({
  template: ''
})
export class AccountsUI implements OnDestroy {
  private _view: Blaze.View;

  constructor(elementRef: ElementRef, @Attribute('align') align: string) {
    var data = align ? { align } : {};
    this._view = Blaze.renderWithData(Template.loginButtons, data,
      elementRef.nativeElement);
  }

  ngOnDestroy() {
    Blaze.remove(this._view);
  }
}
