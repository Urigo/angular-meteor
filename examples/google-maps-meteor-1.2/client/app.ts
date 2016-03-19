import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2-meteor';

import {
  MapsAPILoader,
  NoOpMapsAPILoader,
  MouseEvent,
  ANGULAR2_GOOGLE_MAPS_PROVIDERS,
  ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'ng2-google-maps/core';

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'app'
})
@View({
  templateUrl: 'client/app.html',
  directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES]
})
class Main {
  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    window.alert(`clicked the marker: ${label || index}`)
    this.markers.splice(index, 1);
  }


  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]
}

Meteor.startup(function() {
  bootstrap(Main, [ANGULAR2_GOOGLE_MAPS_PROVIDERS]);
});
