import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
  redirectUrl: string;
  currentPath: any;
  constructor(
    private router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
   ) {
    const user = localStorage.getItem('idUser');
    if (user === null) {
    this.router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }
}
