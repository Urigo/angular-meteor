'user strict';

var oldRegister = System.register;
var mainRegex = /^server\/main$/;
var appRegex = /(^client\/app$)|(^app$)/g;
System.register = function(name, deps, declare) {
  oldRegister.call(this, name, deps, declare);

  // Imports server main module (server/main.ts).
  if (Meteor.isServer && mainRegex.test(name)) {
    Meteor.startup(function() {
      // Does import synchronously in the main app fiber.
      System.import(name).await();
    });
  }

  // Imports client main module (client/app.ts).
  if (Meteor.isClient && appRegex.test(name)) {
    Meteor.startup(function() {
      System.import(name);
    });
  }
};
