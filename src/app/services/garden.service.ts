import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
interface Garden {
  id?: string;
  name: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: firebase.firestore.Timestamp;
  approved: boolean;
  createdBy: string;
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
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        approved: false,
        createdBy: newGarden.createdBy
      };
      return this.firestore.collection<Garden>('gardens').add(garden);
  }

  getGardens(): Observable<Garden[]> {
    return this.firestore.collection<Garden>('gardens').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Garden;
        const id = a.payload.doc.id;
        return { id, ...data }; 
      }))
    );
  }
  approveGarden(gardenId: string): Promise<void> {
    return this.firestore.collection('gardens').doc(gardenId).update({ approved: true });
  }

  rejectGarden(gardenId: string): Promise<void> {
    return this.firestore.collection('gardens').doc(gardenId).delete();
  }
}
