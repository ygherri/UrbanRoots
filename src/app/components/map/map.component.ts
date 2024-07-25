import { Component, OnInit } from '@angular/core';
import { GardenService } from '../../services/garden.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 

interface Garden {
  name: string;
  description: string;
  type: string;
  location: { latitude: number; longitude: number };
  createdAt: firebase.firestore.Timestamp;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  gardens$: Observable<Garden[]> | undefined;
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 }; // Centered on Paris
  zoom = 12;

  constructor(private gardenService: GardenService) {}

  ngOnInit(): void {
    this.gardens$ = this.gardenService.getGardens();
  }
}
