import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: Firestore) {}

  getEventsByGarden(gardenId: string): Observable<Event[]> {
    const eventsCollection = collection(this.firestore, 'events');
    const q = query(eventsCollection, where('gardenId', '==', gardenId));
    return collectionData(q, { idField: 'id' }) as Observable<Event[]>;
  }

  getAllEvents(): Observable<Event[]> {
    const eventsCollection = collection(this.firestore, 'events');
    return collectionData(eventsCollection, { idField: 'id' }) as Observable<Event[]>;
  }

  addEvent(event: Event): Promise<void> {
    const eventsCollection = collection(this.firestore, 'events');
    return addDoc(eventsCollection, event).then(() => {});
  }

  deleteEvent(eventId: string): Promise<void> {
    const eventDoc = doc(this.firestore, `events/${eventId}`);
    return deleteDoc(eventDoc);
  }

  updateEvent(eventId: string, updatedEvent: Partial<Event>): Promise<void> {
    const eventDoc = doc(this.firestore, `events/${eventId}`);
    return updateDoc(eventDoc, updatedEvent);
  }
}
