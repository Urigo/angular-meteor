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

  Template.partiesBlazeTemplate.helpers({
    parties: function() {
      return Template.currentData().getReactively('parties', true);
    }
  });
}