import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
interface Garden {
  name: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class GardenService {
    constructor(private firestore: AngularFirestore) {}

  addGarden(newGarden: any): Promise<firebase.firestore.DocumentReference<Garden>> {
    const garden: Garden = {
        ...newGarden,
        location: {
          latitude: parseFloat(newGarden.latitude),
          longitude: parseFloat(newGarden.longitude)
        },
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp
      };
      return this.firestore.collection<Garden>('gardens').add(garden);
  }

  getGardens(): Observable<Garden[]> {
    return this.firestore.collection<Garden>('gardens').valueChanges();
  }
}
