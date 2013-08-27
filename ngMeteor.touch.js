var ngGestures = ['ngHold:hold',
                  'ngTap:tap',
                  'ngDoubletap:doubletap',
                  'ngDrag:drag',
                  'ngDragstart:dragstart',
                  'ngDragend:dragend',
                  'ngDragup:dragup',
                  'ngDragdown:dragdown',
                  'ngDragleft:dragleft',
                  'ngDragright:dragright',
                  'ngSwipe:swipe',
                  'ngSwipeup:swipeup',
                  'ngSwipedown:swipedown',
                  'ngSwipeleft:swipeleft',
                  'ngSwiperight:swiperight',
                  'ngTransformstart:transformstart',
                  'ngTransform:transform',
                  'ngTransformend:transformend',
                  'ngRotate:rotate',
                  'ngPinch:pinch',
                  'ngPinchin:pinchin',
                  'ngPinchout:pinchout',
                  'ngTouch:touch',
                  'ngRelease:release'];

angular.forEach(ngGestures, function(name){
  var directive = name.split(':'),
  directiveName = directive[0],
  eventName = directive[1];
  angular.module('ngMeteor.touch', []).directive(directiveName, ["$parse", function($parse) {
    return {
      scope: true,
      link: function(scope, element, attr) {
        var fn, opts;
        fn = $parse(attr[directiveName]);
        opts = $parse(attr["ngTouchOptions"])(scope, {});
        if(opts && opts.group) {
          scope.hammer = scope.hammer || Hammer(element[0], opts);
        } else {
          scope.hammer = Hammer(element[0], opts);
        }
        return scope.hammer.on(eventName, function(event) {
          return scope.$apply(function() {
            return fn(scope, {
              $event: event
            });
          });
        });
      }
    };
    }
  ]);
});