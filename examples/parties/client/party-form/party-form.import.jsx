import {Component, View} from 'angular2/angular2';
import {FORM_DIRECTIVES, Control, ControlGroup, Validators} from 'angular2/angular2';

@Component({
  selector: 'party-form'
})
@View({
  templateUrl: 'client/party-form/party-form.ng.html',
  directives: [FORM_DIRECTIVES]
})
export class PartyForm {
  partyForm: ControlGroup;

  constructor() {
    this.partyForm = new ControlGroup({
      name: new Control('', Validators.required),
      description: new Control('', Validators.required),
      location: new Control('', Validators.required)
    });
  }

  add(event) {
    event.preventDefault();

    var party: IParty = this.partyForm.value;

    if (this.partyForm.valid) {
      Parties.insert({
        name: party.name,
        description: party.description,
        location: party.location
      });

      this.partyForm.controls.name.updateValue('');
      this.partyForm.controls.description.updateValue('');
      this.partyForm.controls.location.updateValue('');
    }
  }
}
