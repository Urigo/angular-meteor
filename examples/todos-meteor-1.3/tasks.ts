export let Tasks = new Mongo.Collection<Task>('tasks');

Meteor.methods({
  addTask: function(text) {
    Tasks.insert({
      text: text,
      checked: false,
      private: false
    });
  },

  deleteTask: function(taskId) {
    Tasks.remove(taskId);
  },

  setChecked: function(taskId, setChecked) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: {checked: setChecked}
    });
  },

  setPrivate: function(taskId, setToPrivate) {
    let task = Tasks.findOne(taskId);
    Tasks.update(taskId, {
      $set: {private: setToPrivate}
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  });
}
