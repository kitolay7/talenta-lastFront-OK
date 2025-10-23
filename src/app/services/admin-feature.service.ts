import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export type QuizMode = 'all' | 'av' | 'none'; // 'av' = Audio & Vidéo uniquement
const STORAGE_KEY = 'quiz_mode';
const API_URL = '/admin/settings/quiz-mode';//`${environment.baseUrl}admin/settings/quiz-mode`; 
// ↳ exemple: GET -> { mode: 'all'|'av'|'none' }, PUT -> body { mode }

@Injectable({ providedIn: 'root' })
export class AdminFeatureService {
  private _mode$ = new BehaviorSubject<QuizMode>(this.readLocal() ?? 'all');
  readonly mode$ = this._mode$.asObservable();

  private loading = false;
  private loadedOnce = false;

  constructor(private http: HttpClient, private zone: NgZone) {
    // Sync entre onglets du même navigateur
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && typeof e.newValue === 'string') {
        const mode = this.normalize(e.newValue);
        if (mode && mode !== this._mode$.value) {
          // runOutsideAngular => éviter cycles inutiles
          this.zone.run(() => this._mode$.next(mode));
        }
      }
    });
  }

  /** Charge depuis le serveur si pas encore fait (avec cache local en fallback) */
  ensureLoaded(): void {
    if (this.loadedOnce || this.loading) return;
    this.loading = true;
    this.http.get<{ mode: QuizMode }>(API_URL)
      .pipe(
        first(),
        tap(res => {
          const mode = this.normalize(res?.mode) ?? 'all';
          this.writeLocal(mode);
          this._mode$.next(mode);
          this.loadedOnce = true;
        }),
        catchError(() => {
          // en cas d’erreur serveur, on garde la valeur locale
          this.loadedOnce = true;
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  /** Définit le mode côté serveur + met en cache local + notifie */
  setMode(mode: QuizMode): Observable<any> {
    const next = this.normalize(mode) ?? 'all';
    // Optimistic UI
    this.writeLocal(next);
    this._mode$.next(next);

    return this.http.put(API_URL, { mode: next }).pipe(
      catchError(err => {
        // si erreur serveur, on pourrait recharger la dernière valeur serveur
        // ici, on laisse la valeur locale mais on remonte l’erreur
        throw err;
      })
    );
  }

  /** Lecture “immédiate” (cache) */
  get current(): QuizMode {
    return this._mode$.value;
  }

  // Helpers

  private readLocal(): QuizMode | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return this.normalize(raw);
  }

  private writeLocal(mode: QuizMode): void {
    localStorage.setItem(STORAGE_KEY, mode);
  }

  private normalize(v: any): QuizMode | null {
    return v === 'all' || v === 'av' || v === 'none' ? v : null;
  }
}
