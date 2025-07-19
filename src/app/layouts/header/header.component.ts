import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  @ViewChild('menuRef') menuRef!: ElementRef; 
  @ViewChild('burgerRef') burgerRef!: ElementRef;
  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.currentUser$.pipe(
      map(user => user && 'role' in user ? (user as CustomUser).role === 'admin' : false)
    );
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => console.log('Current User:', user));
  this.isAdmin$.subscribe(isAdmin => console.log('Is Admin:', isAdmin));
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });
  }
   @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideMenu = this.menuRef?.nativeElement.contains(event.target);
    const clickedBurger = this.burgerRef?.nativeElement.contains(event.target);
    if (!clickedInsideMenu && !clickedBurger) {
      this.menuActive = false;
    }
  }

  signOut() {
    this.authService.signOut();
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
  closeMenu() {
    this.menuActive = false;
  }
}
