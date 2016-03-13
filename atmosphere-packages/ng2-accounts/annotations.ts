

'use strict';

import {TypeDecorator} from 'angular2/core';

import {makeDecorator} from 'angular2/src/core/util/decorators';

import {ComponentInstruction} from 'angular2/router';

import {CanActivate} from 'angular2/src/router/lifecycle/lifecycle_annotations_impl';

class InjectUserAnnotation {
  constructor(public propName: string = 'user') {}
}

export function InjectUser(propName: string): (cls: any) => any {
  var annInstance = new InjectUserAnnotation(propName);
  var TypeDecorator: TypeDecorator = <TypeDecorator>function TypeDecorator(cls) {
    var propName = annInstance.propName;
    var fieldName = `_${propName}`;
    var injected = `${fieldName}Injected`;
    Object.defineProperty(cls.prototype, propName, {
      get: function() {
        if (!this[injected]) {
          this[fieldName] = Meteor.user();
          if (this.autorun) {
            this.autorun(() => {
              this[fieldName] = Meteor.user();
            }, true);
          }
          this[injected] = true;
        }
        return this[fieldName];
      },
      enumerable: true,
      configurable: false
    });
    return cls;
  };
  return TypeDecorator;
};

/**
 * Here CanActivate is an internal class (not present in the typings)
 * defined at angular/modules/angular2/src/router/lifecycle_annotations_impl.ts.
 * Each annotation designed to implement activation logic should extend it.
 */
class RequireUserAnnotation extends CanActivate {
  constructor() {
    super(this.canProceed.bind(this));
  }

  canProceed(prev: ComponentInstruction,
    next: ComponentInstruction) {
    return !!Meteor.user();
  }
}

export const RequireUser = makeDecorator(RequireUserAnnotation);
