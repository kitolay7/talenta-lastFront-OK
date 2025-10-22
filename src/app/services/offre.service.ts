import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class OffreService {
  url = environment.baseUrl;
  private offreID: BehaviorSubject<any> = new BehaviorSubject('');
  items: any;

  constructor(private http: HttpClient, private socket: Socket) {
    this.offreID.subscribe(_ => this.items = _);
  }
  public addOffre(data): Observable<any> {
    return this.http.post(this.url + 'createOffre', data);
  }
  public getOffre(): Observable<any> {
    return this.http.get(this.url + 'getAllOffer');
  }
  public geteOfferByPays(pays): Observable<any> {
    return this.http.get(this.url + 'getofferByPays/' + pays);
  }
  public geteOfferByUser(id): Observable<any> {
    return this.http.get(this.url + 'getAllOfferbyUser/' + id);
  }
  public geteOfferUser(id): Observable<any> {
    return this.http.get(this.url + 'getOffreUser/' + id);
  }
  public setFolderOffer(data): Observable<any> {
    return this.http.put(this.url + 'offerFolder', data);
  }
  public getAllFolderUser(data): Observable<any> {
    return this.http.get(this.url + 'getAllFolder/' + data);
  }
  public getOneFolder(data): Observable<any> {
    return this.http.get(this.url + 'findFolder/' + data);
  }
  public setRemarque(data): Observable<any> {
    return this.http.put(this.url + 'offreRemarque/', data);
  }
  public getedetailOfferByUser(a, b): Observable<any> {
    if (a) {
      return this.http.get(this.url + 'findOffer/' + b);
    }
    return this.http.get(this.url + 'findOffer/' + b);
  }
  setOffre(a) {
    this.offreID.next(a);

    console.log(a, this.offreID)
  }
  getOffreId(): Observable<any> {
    return this.offreID.asObservable();
  }
  public getUsersByOffer(id): Observable<any> {
    return this.http.get(this.url + 'offre/' + id + '/users');
  }
  updateArchive(a, id): Observable<any> {
    return this.http.put(this.url + 'updateArchive/' + id, a);
  }

  updateOffreQuizzArchive(offerId, quizId, dataArchive): Observable<any> {
    return this.http.put(this.url + "offre/" + offerId +"/"+ quizId + "/updateArchive", dataArchive);
  }

  reUpdateOffreQuizzArchive(offerId, folderId, dataArchive): Observable<any> {
    return this.http.put(this.url + "offre/" + offerId +"/reUpdateArchive/"+folderId, dataArchive);
  }

  updatePublier(a, id): Observable<any> {
    return this.http.put(this.url + 'updatePublier/' + id, a);
  }
  public updatePostulation(data): Observable<any> {
    return this.http.put(this.url + 'postulation/update', data);
  }
  public getOffersByUser(userId): Observable<any> {
    return this.http.get(this.url + 'users/' + userId + '/offres');
  }
  public setFolder(data): Observable<any> {
    return this.http.post(this.url + 'createFolder', data);
  }
  public getOfferByCreatorPublished(userId): Observable<any> {
    return this.http.get(this.url + 'users/' + userId + '/offresPublished');
  }
  public listingOffreCand(userId): Observable<any> {
    return this.http.get(this.url + 'offreCandidat/' + userId);
  }
  public getLastLogo(userId): Observable<any> {
    return this.http.get(this.url + 'users/' + userId + '/lastLogo');
  }
  public deleteOffre(offreId): Observable<any> {
    return this.http.delete(this.url + 'offres/' + offreId + '/delete');
  }
  public getQuestionsByOffer(offreId): Observable<any> {
    return this.http.get(this.url + 'quiztooffer/' + offreId);
  }
  public getFreeCurrentOffers(userId, currentIdOffer): Observable<any> {
    return this.http.get(this.url + 'users/' + userId + '/offres/' + currentIdOffer + '/free');
  }

}
