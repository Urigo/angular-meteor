'use strict';

var Template;

describe('Given the Template Service', function() {

  describe('when it runs', function() {

    var $templateCache;

    beforeEach(function() {

      Template = {
        _x: 'ignore',
        prototype: 'ignore',
        other: 'good',
        loginButtons: 'ignore'
      };

      module('angular-meteor.template');

      inject(function(_$templateCache_) {
        $templateCache = _$templateCache_;
      });

    });

    it('should ignore templates with names "prototype", "loginButtons" or starting with _', function() {

      var output1 = $templateCache.get('other');
      expect(output1).toEqual('<ng-template name="other"></span>');

      var output2 = $templateCache.get('_x');
      expect(output2).toBeUndefined();

      var output3 = $templateCache.get('prototype');
      expect(output3).toBeUndefined();

      var output4 = $templateCache.get('loginButtons');
      expect(output4).toBeUndefined();

    });

  });

});
