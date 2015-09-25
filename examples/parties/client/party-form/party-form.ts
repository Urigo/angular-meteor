/// <reference path="../../typings/all.d.ts" />

import {Component, View} from 'angular2/angular2';
import {FORM_DIRECTIVES, Control, FormBuilder, ControlGroup, Validators} from 'angular2/angular2';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-form'
})
@View({
  templateUrl: 'client/party-form/party-form.html',
  directives: [FORM_DIRECTIVES],
})
export class PartyForm {
  partyForm: ControlGroup;

  constructor() {
    var fb = new FormBuilder()
    this.partyForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  add(event) {
    event.preventDefault();

    var party: Party = this.partyForm.value;

    if (this.partyForm.valid) {
      Parties.insert({
        name: party.name,
        description: party.description,
        location: party.location
      });

      this.partyForm.controls['name'].updateValue('');
      this.partyForm.controls['description'].updateValue('');
      this.partyForm.controls['location'].updateValue('');
    }
  }
}
