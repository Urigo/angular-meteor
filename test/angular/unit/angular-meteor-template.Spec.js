'use strict';

var Template, Blaze, UI;

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
      expect(output1).toEqual('<ng-template name="other"></ng-template>');

      var output2 = $templateCache.get('_x');
      expect(output2).toBeUndefined();

      var output3 = $templateCache.get('prototype');
      expect(output3).toBeUndefined();

      var output4 = $templateCache.get('loginButtons');
      expect(output4).toBeUndefined();

    });

  });

});

describe('Given the meteorInclude directive', function() {

  var $rootScope, $compile, $scope, element, elm;

  beforeEach(function() {

    module('angular-meteor.template');

    Template = {
      myTemplate: {
        _events: {
          event1: {
            events: 'click',
            selector: 'div',
            handler: 'handler'
          }
        },
        render: false
      }
    };

    Blaze = {
      renderWithData: jasmine.createSpy('Blaze'),
      toHTML: jasmine.createSpy('BlazeToHTML')

    };

    UI = {
      toHTML: function(){}
    };

    inject(function(_$rootScope_, _$compile_){

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = $rootScope.$new();
    });

    spyOn(console, 'error');

  });

  describe('when using the "meteor-include" directive', function() {

    it('should let Blaze to do their thing instead of compiling the template', function() {

      //console.log(Object.getOwnPropertyNames(elm['0']));
      elm = angular.element('<meteor-include src="myTemplate"></meteor-include>');
      element = $compile(elm)($scope);
      $scope.$digest();

      expect(Blaze.renderWithData).toHaveBeenCalled();

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

  describe('when using the "ng-template"', function() {

    it('should invoke Blaze.toHTML', function() {

      elm = angular.element('<ng-template name="myTemplate"></ng-template>');
      element = $compile(elm)($scope);
      $scope.$digest();

      expect(Blaze.toHTML).toHaveBeenCalled();

    });

    it('should bind jQuery events from the Blaze template', function() {

      var bindSpy = jasmine.createSpy();

      spyOn(window, '$').and.returnValue({
        bind: bindSpy
      });

      elm = angular.element('<ng-template name="myTemplate"></ng-template>');
      element = $compile(elm)($scope);
      $scope.$digest();

      expect(window.$).toHaveBeenCalledWith('ng-template[name="myTemplate"] div')
      expect(bindSpy).toHaveBeenCalledWith('click', 'handler')

    });


     describe('with an old version of Meteor', function() {

       beforeEach(function() {
         Template.myTemplate.render = true;
       });


       it('should invoke Blaze.toHTML', function() {

         elm = angular.element('<ng-template name="myTemplate"></ng-template>');
         element = $compile(elm)($scope);
         $scope.$digest();

         expect(Blaze.toHTML).toHaveBeenCalled();

       });

     });
  });

});
