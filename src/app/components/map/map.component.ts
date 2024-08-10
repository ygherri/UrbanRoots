import { Component, OnInit, ViewChild  } from '@angular/core';
import { GardenService } from '../../services/garden.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';


interface Garden {
  id?: string;
  name: string;
  description: string;
  type: string;
  location: { latitude: number; longitude: number };
  createdAt: firebase.firestore.Timestamp;
  approved: boolean;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [GardenService]
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
  zoom = 12;
  markerPositions: google.maps.LatLngLiteral[] = [];
  gardens: Garden[] = [];
  selectedGarden: Garden | null = null;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  constructor(private gardenService: GardenService) {}
  ngOnInit(): void {
    this.gardenService.getGardens().subscribe((gardens: Garden[]) => {
      this.gardens = gardens.filter(garden => garden.approved);
      console.log('Gardens fetched: ', this.gardens);
      this.markerPositions = this.gardens.map(garden => ({
        lat: garden.location.latitude,
        lng: garden.location.longitude
      }));
      console.log('Marker positions: ', this.markerPositions);
    });
  }
  openInfoWindow(marker: MapMarker, index: number) {
    this.selectedGarden = this.gardens[index];
    console.log('Selected garden: ', this.selectedGarden);
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

 
}
