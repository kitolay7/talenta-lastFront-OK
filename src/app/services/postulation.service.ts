import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostulationService {
  url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getPostulation(userId, offreId): Observable<any> {
    return this.http.get(this.url + 'postulation/users/' + userId + '/offres/' + offreId);
  }

  public postule(data): Observable<any> {
    return this.http.post(this.url + 'offre/' + data.offreId + '/postule', data);
  }

  public checktest(data): Observable<any> {
    return this.http.get(this.url + 'checktest/users/' + data.userId + '/offres/' + data.offreId);
  }

  public createPostulationResponses(userId, offreID, data): Observable<any> {
    return this.http.post(this.url + "postulation/users/" + userId + "/offres/" + offreID + "/responses", data);
  }

  public getPostulationResponses(userId, offreID): Observable<any> {
    return this.http.get(this.url + "postulation/users/" + userId + "/offres/" + offreID + "/responses");
  }

  public updatePostulationResponses(userId, offreID, data): Observable<any> {
    return this.http.put(this.url + "postulation/users/" + userId + "/offres/" + offreID + "/update", data);
  }

  public updateFileResponses(userId, offreID, data: FormData): Observable<any> {
    console.log("Test");
    return this.http.post(this.url + "postulation/users/" + userId + "/offres/" + offreID + "/audio/upload", data);
  }

  public updatePostulationResponsesMultiple(userId, offreID, data): Observable<any> {
    return this.http.put(this.url + "postulation/users/" + userId + "/offres/" + offreID + "/responseNote", data);
  }
}
