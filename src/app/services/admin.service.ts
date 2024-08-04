import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private firestore: Firestore) {}

  updateRole(userId: string, role: string) {
    return updateDoc(doc(this.firestore, 'users', userId), { role });
  }
}
