var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.config(['$provide', 
	function ($provide) {
		angular.forEach(this, function(object, key){
			if(object instanceof Meteor.Collection){
				$provide.service(key, function () {
					this.list = object.find().fetch();
					// list, save(will update if an entry exists otherwise it will insert a new entry), delete
				});
			}
		});
	}
]);