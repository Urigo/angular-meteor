angular.module('angularjs-meteor-example').controller('TodoAddController', function($scope){
    $scope.addTodo = function(content){
        Todos.insert({
            content
        });
    }
    $scope.removeTodo = function(todo){
        Todos.remove(todo._id);
    }
});