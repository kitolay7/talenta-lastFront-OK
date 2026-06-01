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
  
}