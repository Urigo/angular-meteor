var ngMeteorCollections = angular.module('ngMeteor.collections', []);

Meteor.startup(function () {
	angular.forEach(this, function(object, key){
		if(object instanceof Meteor.Collection){
			ngMeteorCollections.service(key, function () {
				this.list = object.find().fetch();
				// list, save(will update if an entry exists otherwise it will insert a new entry), delete
			});
		}
	});
});






