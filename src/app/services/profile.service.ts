import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient, private url: string) { }

  create(data): Observable<any> {
    return this.http.post(`${this.url}/profile`, data);
  }
}
