import { Component, OnInit, ViewChild  } from '@angular/core';
import { GardenService, Garden } from '../../services/garden.service'; import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';




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
    this.gardenService.getApprovedGardens().subscribe({
      next: (gardens: Garden[]) => {
        console.log('Raw gardens data:', gardens);
    
        this.gardens = gardens.map(garden => ({
          ...garden,
          createdAt: garden.createdAt instanceof Timestamp ? garden.createdAt.toDate() : garden.createdAt
        })).filter(garden => {
          const hasLocation = garden.location?.latitude && garden.location?.longitude;
          console.log(`Garden ${garden.name} has valid location:`, hasLocation);
          return garden.approved && hasLocation;
        });
    
        console.log('Filtered gardens:', this.gardens); 
    
        this.markerPositions = this.gardens.map(garden => ({
          lat: garden.location.latitude,
          lng: garden.location.longitude
        }));
        console.log('Marker positions:', this.markerPositions);
      },
      error: (err) => console.error('Error fetching gardens:', err),
      complete: () => console.log('Fetching gardens complete')
    });
    
  }
  get createdAtDate(): Date | undefined {
    if (this.selectedGarden?.createdAt instanceof Timestamp) {
      return this.selectedGarden.createdAt.toDate(); // Convertir Firestore Timestamp en JavaScript Date
    } else if (this.selectedGarden?.createdAt instanceof Date) {
      return this.selectedGarden.createdAt;
    }
    return undefined;
  }
  openInfoWindow(marker: MapMarker, index: number) {
    this.selectedGarden = this.gardens[index];
    console.log('Selected garden: ', this.selectedGarden);
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

 
}
