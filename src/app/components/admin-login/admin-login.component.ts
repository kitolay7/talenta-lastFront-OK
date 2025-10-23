import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  showPassword = false;
  errorMessage: string | null = null;

  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  login() {
    if (this.adminAuth.login(this.username, this.password)) {
      this.router.navigate(['/administration']);
    } else {
      this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
  }
}