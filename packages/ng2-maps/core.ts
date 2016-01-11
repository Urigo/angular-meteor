'use strict';

export * from './angular2-google-maps/src/core';

// TODO: Investigate why exports like
// export {FooService} from './services' are traspiled empty.
// That's the reason why some exports from
// ./angular2-google-maps/src/core are duplicated here.

export * from './angular2-google-maps/src/directives/google-map';
export * from './angular2-google-maps/src/directives/google-map-marker';
export * from './angular2-google-maps/src/directives-const';

export * from './angular2-google-maps/src/services/maps-api-loader/maps-api-loader';
export * from './angular2-google-maps/src/services/maps-api-loader/noop-maps-api-loader';
export * from './angular2-google-maps/src/services/maps-api-loader/lazy-maps-api-loader';
