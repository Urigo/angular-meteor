'use strict';

import * as _ from 'underscore';

export declare type CallbacksObject = {
  onReady?: Function;
  onError?: Function;
  onStop?: Function;
};

export declare type MeteorCallbacks = ((...args) => any) | CallbacksObject;

export const subscribeEvents = ['onReady', 'onError', 'onStop'];

export function isMeteorCallbacks(callbacks: any): boolean {
  return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}

// Checks if callbacks of {@link CallbacksObject} type.
export function isCallbacksObject(callbacks: any): boolean {
  return callbacks && subscribeEvents.some((event) => {
    return _.isFunction(callbacks[event]);
  });
};

declare const global;
export const g =
  typeof global === 'object' ? global :
    typeof window === 'object' ? window :
      typeof self === 'object' ? self : this;

export const gZone = g.Zone.current;

export const check = Package['check'].check;


/* tslint:disable */
export const Match = Package['check'].Match;

export function debounce(func, wait, onInit) {
  let timeout, result, data;

  let later = function(context, args) {
    timeout = null;
    result = func.apply(context, [...args, data]);
  };

  let debounced = function(...args) {
    if (!timeout) {
      data = onInit && onInit();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = _.delay(later, wait, this, args);

    return result;
  };

  return debounced;
};

export function noop() {}

export function isListLikeIterable(obj: any): boolean {
  if (!isJsObject(obj)) return false;
  return isArray(obj) ||
      (!(obj instanceof Map) &&      // JS Map are iterables but return entries as [k, v]
       getSymbolIterator() in obj);  // JS Iterable have a Symbol.iterator prop
}

export function isArray(obj: any): boolean {
  return Array.isArray(obj);
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isJsObject(o: any): boolean {
  return o !== null && (typeof o === 'function' || typeof o === 'object');
}

declare var Symbol: any;
var _symbolIterator: any = null;
export function getSymbolIterator(): string|symbol {
  if (isBlank(_symbolIterator)) {
    if (isPresent((<any>g).Symbol) && isPresent(Symbol.iterator)) {
      _symbolIterator = Symbol.iterator;
    } else {
      // es6-shim specific logic
      var keys = Object.getOwnPropertyNames(Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'entries' && key !== 'size' &&
            (Map as any).prototype[key] === Map.prototype['entries']) {
          _symbolIterator = key;
        }
      }
    }
  }
  return _symbolIterator;
}
