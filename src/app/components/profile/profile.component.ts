import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  error: string = '';
  userId: string = '';

  constructor(private authService: AuthService, private auth: Auth, private router: Router) {}

  ngOnInit() {
    user(this.auth).subscribe(async (currentUser: { uid: string; }) => {
      if (currentUser) {
        this.userId = currentUser.uid;
        const userProfile = await this.authService.getUserProfile(this.userId);
        if (userProfile) {
          this.firstName = userProfile['firstName'];
          this.lastName = userProfile['lastName'];
          this.email = userProfile['email'];
        }
      } else {
        console.error('Utilisateur non authentifié');
      }
    });
  }

  updateProfile() {
    this.authService.updateUserProfile(this.userId, { firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password })
      .then(() => this.router.navigate(['/']))
      .catch(error => this.error = error.message);
  }

}
