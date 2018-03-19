angular.module('angularjs-meteor-example').controller('TodoListController', function($scope){
    Tracker.autorun(function(){
        //Put reactive data assignments here!!!
        $scope.todos = Todos.find().fetch();
        $scope.$applyAsync();
    });
    $scope.removeTodo = function(todo){
        Todos.remove(todo._id);
    }
});