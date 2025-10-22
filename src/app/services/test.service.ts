import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
	
	url = environment.baseUrl;

  constructor(private http: HttpClient) { }
  
  createTest(data): Observable<any>  {
    return this.http.post(this.url + 'quiz', data);
  }
  createReponse(data): Observable<any>  {
    return this.http.post(this.url + 'createReponse', data);
  }
  getQuestion(data): Observable<any>  {
    return this.http.post(this.url + 'findReponse', data);
  }
}
