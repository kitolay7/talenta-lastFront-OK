import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  findOneByOffer(offerId): Observable<any> {
    // alert(data)
    return this.http.get(this.url + 'offer/' + offerId + '/quiz');
  }

  findAllQuiz(userId): Observable<any> {
    return this.http.get(this.url + "quizs/" + userId);
  }

  findOneQuizById(userId): Observable<any> {
    return this.http.get(this.url + "quiz/" + userId);
  }

  updateQuizContent(quizId, data): Observable<any> {
    return this.http.put(this.url + "quizs/" + quizId + "/update", data);
  }

  updateQuizStatePublished(quizId, state): Observable<any> {
    return this.http.put(this.url + "quizzs/state/" + quizId + "/update", state)
  }

  updateQuizArchive(quizId, dataArchive): Observable<any> {
    return this.http.put(this.url + "quiz/" + quizId + "/updateArchive", dataArchive);
  }

  findQuizArchived(userId): Observable<any> {
    return this.http.get(this.url + "quizzs/" + userId + "/archived");
  }
}
