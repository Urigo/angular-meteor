import { Meteor } from 'meteor/meteor';

import { Todos } from '../../../imports/collections/todos';

Meteor.publish('todoList', function() {
  return Todos.find({});
});
