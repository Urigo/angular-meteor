import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Todos } from './collections';

Meteor.methods({
  addTodo(content: string) {
    check(content, String);
    return Todos.insert({
      content
    });
  }
});
