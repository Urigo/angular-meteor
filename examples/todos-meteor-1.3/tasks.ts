'use strict';

import {Meteor} from 'meteor/meteor';
import {Mongo} from "meteor/mongo";

export let Tasks = new Mongo.Collection<Task>('tasks');

Meteor.methods({
  'tasks.addTask': function(text: string) {
    Tasks.insert({
      text: text,
      checked: false,
      private: false,
      createdAt: new Date()
    });
  },

  'tasks.deleteTask': function(taskId) {
    Tasks.remove(taskId);
  },

  'tasks.setChecked': function(taskId, setChecked) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: {checked: setChecked}
    });
  },

  'tasks.setPrivate': function(taskId, setToPrivate) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: {private: setToPrivate}
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish('tasks.public', function() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  });
}
