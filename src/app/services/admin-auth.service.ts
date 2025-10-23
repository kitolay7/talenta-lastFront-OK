import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private KEY = 'admin_auth'; // '1' = connecté

  isLoggedIn(): boolean {
    try { return localStorage.getItem(this.KEY) === '1'; } catch { return false; }
  }
  login(): void {
    try { localStorage.setItem(this.KEY, '1'); } catch {}
  }
  logout(): void {
    try { localStorage.removeItem(this.KEY); } catch {}
  }
  
  /*
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '@dm!n2O25') {
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
  }

  isAdmin(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
    */
}