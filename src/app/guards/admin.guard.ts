import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.adminAuth.isLoggedIn() ? true : this.router.parseUrl('/admin-login');
  }

  /*
  canActivate(): Observable<boolean> {
    return this.adminAuth.isAdmin().pipe(
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/admin-login']);
        }
      })
    );
  }
    */
}