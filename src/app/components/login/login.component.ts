import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn() {
    if (this.email && this.password) {
      this.authService.signIn(this.email, this.password)
        .then(() => this.router.navigate(['/home']))
        .catch(error => this.error = error.message);
        console.log('connecté')
    } else {
      this.error = 'Email and password are required';
    }
  }
}
