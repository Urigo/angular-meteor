'use strict';

import {Parties} from 'collections/parties';

export function loadTestData() {
  if (Parties.find().count() === 0) {
    var parties = [{
      'name': 'Dubstep-Free Zone',
      'location': 'Mountain View',
      'description': 'Can we please just for an evening not listen to dubstep.'
    }, {
      'name': 'All dubstep all the time',
      'location': 'Mountain View',
      'description': 'Get it on!'
    }, {
      'name': 'Savage lounging',
      'location': 'Palo Alto',
      'description': 'Leisure suit required. And only fiercest manners.'
    }];

    for (var i = 0; i < parties.length; i++) {
      Parties.insert(parties[i]);
    }

    var locations = ['Mountain View', 'Palo Alto'];
    for (var i = 0; i < 1000; i++) {
      var location = locations[(Math.random() * 2) >> 0];
      Parties.insert({
        name: Fake.sentence(50),
        location: location,
        description: Fake.sentence(100)
      });
    }

    Accounts.createUser({
      username: 'party',
      email: 'admin@socially.com',
      password: 'admin'
    });
  }
}
