
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { _ } from 'meteor/underscore';
import {Mongo} from "meteor/mongo";
import * as faker from 'faker';

export let Tasks = new Mongo.Collection<Task>('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return Tasks.find();
  });
}

Meteor.methods({
  tasks: function() {
    resetDatabase();

    _.times(10, () => Tasks.insert({
      text: faker.random.word()
    }));
  }
});

export let generateData = () => new Promise((resolve) => {
  const testConnection = Meteor.connect(Meteor.absoluteUrl());
  testConnection.call('tasks', () => resolve());
});
