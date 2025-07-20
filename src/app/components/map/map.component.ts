import { Component, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { GardenService, Garden } from '../../services/garden.service'; import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import * as L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';




@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [GardenService],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  gardens: Garden[] = [];

  constructor(private gardenService: GardenService) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/images/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png'
    });
  }

  ngOnInit(): void {
    this.initMap();

    this.gardenService.getApprovedGardens().subscribe({
      next: (gardens: Garden[]) => {
        this.gardens = gardens
          .filter(g => g.approved && g.location?.latitude && g.location?.longitude)
          .map(g => ({
            ...g,
            createdAt: g.createdAt instanceof Timestamp ? g.createdAt.toDate() : g.createdAt
          }));

        this.gardens.forEach(garden => {
          const marker = L.marker([garden.location.latitude, garden.location.longitude])
            .addTo(this.map!)
            this.gardens.forEach(garden => {
  const createdAtDate = garden.createdAt instanceof Timestamp
    ? garden.createdAt.toDate()
    : garden.createdAt;

  const marker = L.marker([garden.location.latitude, garden.location.longitude])
    .addTo(this.map!)
    .bindPopup(`
      <strong>${garden.name}</strong><br>
      ${garden.description}<br>
      Type: ${garden.type}<br>
      Ajouté le: ${new Date(createdAtDate).toLocaleDateString('fr-FR')}
    `);
});
;
        });
      }
    });
  }

  private initMap(): void {
    this.map = L.map('leaflet-map').setView([48.8566, 2.3522], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

 
}
