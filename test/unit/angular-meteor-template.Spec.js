'use strict';

var Template, Blaze;

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

// Work in progress...
describe('Given the meteorInclude directive', function() {

  var $rootScope, $compile, $scope, element, elm;

  beforeEach(function() {

    module('angular-meteor.template');

    Template = {
      myTemplate: '<div>{{city}}</div>'
    };

    Blaze = {
      renderWithData: function(){

        return '<div>barcelona</div>';

      }
    };

    inject(function(_$rootScope_, _$compile_){

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = $rootScope.$new();

        $scope.city = 'barcelona';


    });

    spyOn(console, 'error');

  });

  describe('when using the "meteor-include" directive', function() {

    // I can't get this test to work. There is some weirdness about element.get(0)
    // Todo: research
    xit('should let Blaze to do their thing instead of compiling the template', function() {

      //console.log(Object.getOwnPropertyNames(elm['0']));
      elm = angular.element('<meteor-include src="myTemplate" class="content"></meteor-include>');
      element = $compile(elm)($scope);
      $scope.$digest();
      expect(elm['0'].innerHTML).toEqual('barcelona');
    });


    describe('with an invalid template name', function() {

      it('should display an error in the console', function() {

        elm = angular.element('<meteor-include src="myTemplateFake" class="content"></meteor-include>');
        element = $compile(elm)($scope);
        $scope.$digest();

        expect(console.error).toHaveBeenCalledWith('meteorTemplate: There is no template with the name \'myTemplateFake\'')
      });

    });

  });


});
