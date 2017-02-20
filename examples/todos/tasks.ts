/// <reference types="meteor-typings" />
/// <reference types="angular2-compilers-typings" />

'use strict';

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {MongoObservable} from 'meteor-rxjs';

export type TodoTask = {
  _id?: string,
  text: string,
  checked: boolean,
  private: boolean,
  username?: string,
  owner?: string,
  createdAt?: Date
};

export let Tasks = new MongoObservable.Collection<TodoTask>('tasks');

Meteor.methods({
  'tasks.addTask': function(text: string) {
    Tasks.insert({
      text: text,
      checked: false,
      private: false,
      createdAt: new Date()
    })
  },

  'tasks.deleteTask': function(taskId) {
    Tasks.remove(taskId);
  },

  'tasks.setChecked': function(taskId, setChecked) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: { checked: setChecked }
    });
  },

  'tasks.setPrivate': function(taskId, setToPrivate) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: { private: setToPrivate }
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
