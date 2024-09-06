import { Component, OnInit, Inject  } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { AdminService } from '../../services/admin.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users$: Observable<any[]> | undefined;

  constructor(private adminService: AdminService, private firestore: Firestore, @Inject(Auth) private auth: Auth) {}

  ngOnInit() {
    user(this.auth).subscribe((currentUser: any) => {
      if (currentUser) {
        const usersCollection = collection(this.firestore, 'users');
        this.users$ = collectionData(usersCollection, { idField: 'id' });
      } else {
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
