import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CustomUser extends User {
  role?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>; 
  menuActive = false;
  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.currentUser$.pipe(
      map(user => user && 'role' in user ? (user as CustomUser).role === 'admin' : false)
    );
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => console.log('Current User:', user));
  this.isAdmin$.subscribe(isAdmin => console.log('Is Admin:', isAdmin));
  }

  signOut() {
    this.authService.signOut();
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
