import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type FeatureMode = 'audio' | 'video' | 'all' | 'none';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private features = new BehaviorSubject<FeatureMode>('all');

  setFeatures(mode: FeatureMode) {
    this.features.next(mode);
  }

  getFeatures(): Observable<FeatureMode> {
    return this.features.asObservable();
  }
}