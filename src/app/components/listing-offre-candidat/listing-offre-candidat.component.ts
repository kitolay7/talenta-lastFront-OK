import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OffreService } from '../../../../src/app/services/offre.service';
import { UserService } from '../../../../src/app/services/user.service';

@Component({
  selector: 'app-listing-offre-candidat',
  templateUrl: './listing-offre-candidat.component.html',
  styleUrls: ['./listing-offre-candidat.component.scss']
})
export class ListingOffreCandidatComponent implements OnInit {
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  idUser: any;
  OffreCandidat = [];
  constructor(private offreS: OffreService,
    private userServ: UserService,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;
      this.offreS.listingOffreCand(this.idUser).subscribe(data => {
        this.OffreCandidat = data;
        console.log(data);
      });
    }
  }
  doTest(d) {
    this.router.navigate(['/quiz/' + d]);
  }
  
  goTo(offerid) {
  	this.router.navigateByUrl('postuler/' + offerid + '/fichedeposte');
  	this.offreS.setOffre(offerid);
  }
  ngOnInit(): void {
  }

}
