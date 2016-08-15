'use strict';

export declare type CallbacksObject = {
  onReady?: Function;
  onError?: Function;
  onStop?: Function;
}

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

export const EJSON = Package['ejson'].EJSON;

export const check = Package['check'].check;

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
    if (timeout) clearTimeout(timeout);
    timeout = _.delay(later, wait, this, args);

    return result;
  };

  return debounced;
};
