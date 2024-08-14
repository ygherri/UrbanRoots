import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, getDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { query, Timestamp, where } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http'; 

export interface Garden {
  id: string | number;
  name: string;
  description: string;
  type: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: Timestamp | Date;
  approved: boolean;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class GardenService {
 
  constructor(private firestore: Firestore) {}
  getAllGardens(): Observable<Garden[]> {
    const gardensCollection = collection(this.firestore, 'gardens');
    return collectionData(gardensCollection, { idField: 'id' }) as Observable<Garden[]>;
  }

  getGardenById(gardenId: string): Observable<Garden | undefined> {
    const gardenDocRef = doc(this.firestore, `gardens/${gardenId}`);
    return from(getDoc(gardenDocRef)).pipe(
      map(function (docSnapshot) {
          const data = docSnapshot.data();
          if (data) {
            return { id: docSnapshot.id, ...data } as Garden;
          } else {
            return undefined;
          }
        })
    );
  }

  getGardensByUser(userId: string): Observable<Garden[]> {
    const gardensCollection = collection(this.firestore, 'gardens');
    const userGardensQuery = query(gardensCollection, where('createdBy', '==', userId));
    return collectionData(userGardensQuery, { idField: 'id' }) as Observable<Garden[]>;
  }

  getApprovedGardens(): Observable<Garden[]> {
    const gardensCollection = collection(this.firestore, 'gardens');
    return collectionData(gardensCollection, { idField: 'id' }).pipe(
      map((gardens: any[]) => gardens.filter(garden => garden.approved))
    );
  }

  async addGarden(garden: Garden): Promise<void> {
    const gardensCollection = collection(this.firestore, 'gardens');
    
    garden.createdAt = Timestamp.now();
  
    await addDoc(gardensCollection, garden);
  }

  async approveGarden(gardenId: string): Promise<void> {
    const gardenDoc = doc(this.firestore, `gardens/${gardenId}`);
    await updateDoc(gardenDoc, { approved: true });
  }

  async rejectGarden(gardenId: string): Promise<void> {
    const gardenDoc = doc(this.firestore, `gardens/${gardenId}`);
    return updateDoc(gardenDoc, { approved: false });
  }
  async deleteGarden(gardenId: string): Promise<void> {
    const gardenDoc = doc(this.firestore, `gardens/${gardenId}`);
    return deleteDoc(gardenDoc);
  }
}
