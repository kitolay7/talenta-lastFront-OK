import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.baseUrl;
  data = [{
    name: 'Se connecter',
    mat: 'account_circle',
    path: ''
  }];
  pMenu = [{
    item: 'Espace recruteur',
    path: '/myaccount'
  }];
  private name: BehaviorSubject<any> = new BehaviorSubject(['main-banner']);
  private menu: BehaviorSubject<any> = new BehaviorSubject([this.data]);
  private tokenA: BehaviorSubject<any> = new BehaviorSubject(null);
  private profileMenu: BehaviorSubject<any> = new BehaviorSubject([this.pMenu]);
  items: any;
  private tokenGlobal: BehaviorSubject<any> = new BehaviorSubject(null);
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private userActif: Observable<any>;
  constructor(private http: HttpClient) {
    this.name.subscribe(_ => this.items = _);
    this.menu.subscribe(_ => this.items = _);
    this.profileMenu.subscribe(_ => this.items = _);
    this.tokenGlobal.subscribe(_ => this.items = _);
    this.userSubject.subscribe(_ => this.items = _);
    this.tokenA.subscribe(_ => this.items = _);
  }
  register(data): Observable<any> {
    return this.http.post(this.url + 'api/auth/signup', data);
  }
  login(data): Observable<any> {
    return this.http.post(this.url + 'api/auth/signin', data);
  }
  setTokenA(a) {
    localStorage.setItem('tknaaa', a);
    this.tokenA.next(a);
  }
  userAdmin(data): Observable<any> {
    var header = {
      headers: new HttpHeaders()
        .set('x-access-token', data)
    }
    console.log(header)

    return this.http.get(this.url + 'api/test/admin', {
      headers: new HttpHeaders({ 'x-access-token': data })
    });
  }
  getTokenA(): Observable<any> {
    return this.tokenA.asObservable();
  }
  forgot(data): Observable<any> {
    return this.http.post(this.url + 'api/auth/forgot', data);
  }
  checkReset(data): Observable<any> {
    return this.http.get(this.url + 'reset/' + data);
  }
  updateprofile(data): Observable<any> {
    return this.http.put(this.url + 'api/auth/updateprofile', data);
  }
  setSection(a) {
    this.name.next(a);
  }
  getSection(): Observable<any> {
    return this.name.asObservable();
  }
  getUsers(): Observable<any> {
    return this.http.get(this.url + 'getAllUsers');
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(this.url + 'api/test/user');
  }
  setMenu(a) {
    this.menu.next(a);
  }
  getMenu(): Observable<any> {
    return this.menu.asObservable();
  }
  setProfileMenu(a) {
    this.profileMenu.next(a);
  }
  getProfileMenu(): Observable<any> {
    return this.profileMenu.asObservable();
  }
  storeUserData(idUser, token) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('idUser', idUser);
      localStorage.setItem('Token', token);
      const a = localStorage.getItem('Token');
      const b = localStorage.getItem('idUSer');
      this.setToken(token);
      this.setToken(a);
      this.setUser(idUser);
      resolve(token);
    });
  }
  setToken(a) {
    this.tokenGlobal.next(a);
  }
  getToken(): Observable<any> {
    return this.tokenGlobal.asObservable();
  }
  setUser(a) {
    this.userSubject.next(a);
  }
  getUser(): Observable<any> {
    console.log(this.userSubject)
    return this.userSubject.asObservable();
  }
  getProfilData(a): Observable<any> {
    return this.http.get(this.url + 'api/test/userinfo/' + a);
  }

  currentUser(): Observable<any> {
    if (!this.userActif) {
      console.log(`not already created`);
      this.userActif = this.getProfilData(localStorage.getItem('idUser'));
      return this.getProfilData(localStorage.getItem('idUser'));
    }
    console.log((`created`));
    return this.userActif;
  }
  createSpontaneous(data): Observable<any> {
    return this.http.post(this.url + 'createSpontaneous', data);
  }
  getAllSpontaneous(): Observable<any> {
    return this.http.get(this.url + 'getAllSpontaneous');
  }
  getSpontaneousNonTraiter(): Observable<any> {
    return this.http.get(this.url + 'getSpontaneousNonTraiter');
  }
  getSpontaneousById(id): Observable<any> {
    return this.http.get(this.url + 'getSpontaneousById/' + id);
  }
  updateSpontaneousTraiter(data, id): Observable<any> {
    return this.http.put(this.url + 'updateSpontaneousTraiter/' + id, data);
  }
  editPw(data): Observable<any> {
    return this.http.post(this.url + 'editpassword', data);
  }
  contact(data): Observable<any> {
    return this.http.post(this.url + 'contact', data);
  }
  resetPw(data): Observable<any> {
    return this.http.post(this.url + 'resetpassword', data);
  }
  confirmation(token): Observable<any> {
    return this.http.get(this.url + 'confirmation/' + token);
  }
  sendMailCandidat(data): Observable<any> {
    return this.http.post(this.url + 'sendMailCandidat', data);
  }
  updateUserRecruteur(data, userId): Observable<any> {
    return this.http.put(this.url + 'updateRecruteurProfile/' + userId, data);
  }
}
