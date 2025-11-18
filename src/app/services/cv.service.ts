import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private url = environment.baseUrl + 'api/cv/';

  constructor(private http: HttpClient) {}

  filterCvs(criteria: any, cvs: any[]): Observable<any> {
    return this.http.post(this.url + 'filter', { criteria, cvs });
  }
}
