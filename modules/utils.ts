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
