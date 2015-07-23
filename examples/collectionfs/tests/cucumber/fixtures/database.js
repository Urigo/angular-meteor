(function () {

  'use strict';

  Meteor.methods({
    'reset' : function() {
      Images.remove({});
    }
  });

})();
