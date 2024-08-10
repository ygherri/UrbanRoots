import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, updateEmail, User, user  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.currentUser$ = user(this.auth);
  }
  getAuthUser() {
    return user(this.auth);
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const hashedPassword = await bcrypt.hash(password, 10);
      await setDoc(doc(this.firestore, 'users', user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        role: 'member'
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription : ', error);
    }
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
  async getUserProfile(userId: string) {
    const userDoc = await getDoc(doc(this.firestore, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  }

  async updateUserProfile(userId: string, data: { firstName?: string, lastName?: string, email?: string, password?: string }) {
    if (data.email) {
      await updateEmail(this.auth.currentUser as User, data.email);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
      await updatePassword(this.auth.currentUser as User, data.password);
    }
    await updateDoc(doc(this.firestore, 'users', userId), data);
  }
}
