if (Meteor.isClient) {

  angular.module('blaze-angular-scope',['angular-meteor']);

  angular.module("blaze-angular-scope").controller("AngularCtrl", ['$scope',
    function($scope){

      $scope.parties = [
        {'name': 'Dubstep-Free Zone',
          'description': 'Can we please just for an evening not listen to dubstep.'},
        {'name': 'All dubstep all the time',
          'description': 'Get it on!'}
      ];

    }]);

  Template.partiesBlazeTemplate.onCreated(function () {
    // getAngularScope is a helper function supplied by angular-meteor
    getAngularScope(this);
  });

  Template.partiesBlazeTemplate.helpers({
    parties: function() {
      if (Template.instance().$scope)  // Make sure scope is already defined as Blaze loads before Angular
        return Template.instance().$scope.parties
    }
  });
}