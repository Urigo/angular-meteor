import { Meteor } from 'meteor/meteor';
import { Todos } from './collections';

Meteor.publish('todos', function () {
  return Todos.find();
});
