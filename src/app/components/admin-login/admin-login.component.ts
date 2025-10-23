import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username = ''; password = '';
  errorMessage: string | null = null;
  showPassword = false;

  constructor(private auth: AdminAuthService, private router: Router, private route: ActivatedRoute) {}

  login() {
    if (this.username === 'admin' && this.password === '@dm!n2O25') {
      this.auth.login(); // ✅ persiste
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/administration';
      this.router.navigateByUrl(redirect, { replaceUrl: true });
    } else {
      alert('Identifiants invalides');
      this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
  }
  /*
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
  */
}