import { Component, OnInit, OnChanges, DoCheck, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { Router, Event, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { OffreService } from 'src/app/services/offre.service';
import { Observable } from 'rxjs';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges, DoCheck, AfterViewChecked {

  idOffre: any;
  id: any;
  userId: any;
  profil: any;
  username: any;
  public isMyProfile: boolean;
  public isMyaccount: boolean;
  refresh: any;
  isReadonly = true;
  public offer: Observable<any> = of([]);

  constructor(
    private router: Router,
    private userServ: UserService,
    private location: Location,
    private offreS: OffreService,
  ) {
    this.checkMyaccount();

    this.offer = this.offreS.getOffreId();
    this.offer.subscribe((data: any) => {
      this.idOffre = data;
    })
  }
  goTo(path, id) {
    this.id = id;
    if (id !== 3) {
      this.router.navigateByUrl(path);
    } else {
      this.logout();
    }
  }
  logout() {
    localStorage.clear();
    window.location.reload();
  }
  editForm() {
    if (this.isMyProfile) {
      this.isReadonly = !this.isReadonly;
    } else {
      this.router.navigate(['/candidat/profile']);
    }
  }
  postuler() {
    this.router.navigate(['/quiz/' + this.idOffre]);
  }
  fichedeposte() {
    this.router.navigate(['/postuler/' + this.idOffre + '/fichedeposte']);
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    //console.log(localStorage.getItem('idUser'));
    this.userId = localStorage.getItem('idUser');
    //console.log(this.userId)
    this.userServ.getProfilData(this.userId).subscribe((data: any) => {
      this.profil = data;
      this.username = data.username;
      //console.log(data)
    })
  }
  ngDoCheck() {

  }

  ngAfterViewChecked() {

  }

  ngOnDestroy() {
    if (this.refresh) {
      this.refresh.unsubscribe();
    }
  }

  checkMyaccount() {

    this.location.onUrlChange(x => {
      this.isMyaccount = (x === '/myaccount') ? true : false;
      this.isMyProfile = (x === '/candidat/profile') ? true : false;

      //console.log(this.isMyaccount);
      //console.log(x);
      //window.location.reload();
    });
  }

}
