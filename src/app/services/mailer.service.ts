import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from "rxjs";
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailerService {
  url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public sendMail(data): Observable<any> {
    return this.http.post(this.url + 'test_mailer', data);
  }

  public sendMailGroup(data): Observable<any> {
    return this.http.post(this.url + 'send_mail_group', data)
  }
}
