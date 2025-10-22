import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OffreService } from 'src/app/services/offre.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fiche-poste',
  templateUrl: './fiche-poste.component.html',
  styleUrls: ['./fiche-poste.component.scss']
})
export class FichePosteComponent implements OnInit {

  slide: any;
  loading = false;
  url = environment.baseUrl;
  offreData: any = [];
  idoffer: any;
  idUser: any;
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  public sectionSubject: Observable<any> = of([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private offre: OffreService,
    private userServ: UserService,
    private router: Router) {
    this.sectionSubject = this.userServ.getUser();
    this.sectionSubject.subscribe((data: any) => {
      this.currentSection = data;
      console.log(data)
    });
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;
    }
  }

  ngOnInit(): void {
  	
    this.activatedRoute.params.subscribe((params: any) => {
      this.idoffer = params.idOffer;
      this.offre.getedetailOfferByUser(this.idUser, this.idoffer).subscribe((data: any) => {
        console.log(data)
        this.offreData = data.data;
        this.loading = true;
      });
    });
  }

}
