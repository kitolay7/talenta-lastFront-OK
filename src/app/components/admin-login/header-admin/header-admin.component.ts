import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent {
  constructor(private auth: AdminAuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin-login']); // retour sur la page de login admin
  }
}
