import { Component, OnInit } from '@angular/core';
import { GardenService } from '../../services/garden.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';


interface Garden {
  name: string;
  description: string;
  type: string;
  location: { latitude: number; longitude: number };
  createdAt: firebase.firestore.Timestamp;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 }; // Centered on Paris
  zoom = 12;
  markerPositions: google.maps.LatLngLiteral[] = [];

  ngOnInit(): void {
    this.markerPositions = [
      { lat: 48.8566, lng: 2.3522 },
    ];
  }
}
