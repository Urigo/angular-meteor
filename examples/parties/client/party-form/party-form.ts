/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/socially.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';

import {FORM_DIRECTIVES, Control, FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {InjectUser} from 'meteor-accounts';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-form'
})
@View({
  templateUrl: 'client/party-form/party-form.html',
  directives: [FORM_DIRECTIVES],
})
@InjectUser()
export class PartyForm extends MeteorComponent {
  partyForm: ControlGroup;
  user: Meteor.User;

  constructor() {
    super();

    var fb = new FormBuilder()
    this.partyForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  add(event) {
    event.preventDefault();

    if (!this.user) {
      alert('Please, log in as user: party, pwd: admin to add parties');
      return;
    }

    var party: Party = this.partyForm.value;

    if (this.partyForm.valid) {
      Parties.insert({
        name: party.name,
        description: party.description,
        location: party.location
      });

      (<Control>this.partyForm.controls['name']).updateValue('');
      (<Control>this.partyForm.controls['description']).updateValue('');
      (<Control>this.partyForm.controls['location']).updateValue('');
    }
  }
}
