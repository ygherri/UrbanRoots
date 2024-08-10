import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Discussion } from '../models/discussion';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  getDiscussions(): Observable<Discussion[]> {
    return this.firestore.collection<Discussion>('discussions', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Discussion;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createDiscussion(discussion: Discussion): Promise<void> {
    const id = this.firestore.createId();
    return this.auth.currentUser.then(user => {
      if (user) {
        discussion.userId = user.uid;
        discussion.userName = user.displayName || user.email || 'Anonyme';
        discussion.createdAt = new Date();
        return this.firestore.doc(`discussions/${id}`).set(discussion);
      } else {
        throw new Error('User not authenticated');
      }
    });
  }

  deleteDiscussion(id: string): Promise<void> {
    return this.firestore.doc(`discussions/${id}`).delete();
  }
}
