import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { AdminService } from '../../services/admin.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Auth } from 'firebase/auth';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users$: Observable<any[]> | undefined;

  constructor(private adminService: AdminService, private firestore: Firestore, private auth: Auth) {}

  ngOnInit() {
    user(this.auth).subscribe((currentUser: any) => {
      if (currentUser) {
        // Utilisateur authentifié, récupérer les utilisateurs
        this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
      } else {
        // Utilisateur non authentifié, gérer l'accès ici
        console.error('Utilisateur non authentifié');
      }
    });
  }

  makeAdmin(userId: string) {
    this.adminService.updateRole(userId, 'admin');
  }

  makeMember(userId: string) {
    this.adminService.updateRole(userId, 'member');
  }

}
