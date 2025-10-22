import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from 'src/app/services/offre.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-detail-offer-recruteur',
  templateUrl: './detail-offer-recruteur.component.html',
  styleUrls: ['./detail-offer-recruteur.component.scss']
})
export class DetailOfferRecruteurComponent implements OnInit {
  title = "Details de l'offre";
  loading = false;
  url = environment.baseUrl;
  offreData: any = [];
  idoffer: any;
  idUser: any;
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  public sectionSubject: Observable<any> = of([]);
  blobLogo: any;
  blobLogoObject: any;
  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offre: OffreService,
    private toastr: ToastrService,
    private userServ: UserService) {
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
    // si il y a logo

    // si il n'y pas de logo
    this.offre.getLastLogo(localStorage.getItem('idUser')).subscribe(response => {
      if (!response.error && response.data) {
        this.blobLogo = this.url + response.data.path;
      }
      else if (!response.error && !response.data) {
        fetch("assets/img/10.jpg")
          .then(res => res.blob())
          .then(blob => {
            // console.log(URL.createObjectURL(blob).split(":").splice(0, 1).join(":"));
            this.blobLogoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
          })
      }
    })
  }
  nonArchiver() {
    this.loading = true;
    const offer = {
      archived: false
    }
    this.offre.updateArchive(offer, this.idoffer).subscribe((res: any) => {
      this.loading = false;
      this.toastr.success('Offre non Archivé', '', {
        timeOut: 4000
      });
      window.location.reload();
    })
  }
  archiver() {

    if (this.offreData.archived) {
      this.offre.updateArchive({ archived: this.offreData.archived }, this.idoffer).subscribe((res: any) => {
        this.offreData.publier = false;
        this.offre.updatePublier({ publier: false }, this.idoffer).subscribe((res: any) => {
        })
        this.toastr.success('Offre Archivé', '', {
          timeOut: 4000
        });
      })
    }
    else {
      this.offre.updateArchive({ archived: this.offreData.archived }, this.idoffer).subscribe((res: any) => {
        this.toastr.success('Offre non Archivé', '', {
          timeOut: 4000
        });
      })
    }
    // this.loading = true;
    // const pub = {
    //   publier: false
    // }
    // this.offre.updatePublier(pub, this.idoffer).subscribe((res: any) => {
    //   console.log(res)
    // })
    // const offer = {
    //   archived: true
    // }
    // this.offre.updateArchive(offer, this.idoffer).subscribe((res: any) => {
    //   console.log(res)
    //   this.loading = false;
    //   this.toastr.success('Offre Archivé', '', {
    //     timeOut: 2000
    //   });
    //   // window.location.reload();
    // })
  }
  nonPublier() {
    // this.loading = true;
    // const offer = {
    //   publier: false
    // }
    // this.offre.updatePublier(offer, this.idoffer).subscribe((res: any) => {
    //   console.log(res)
    //   this.loading = false;
    //   this.toastr.success('offre non Publié', '', {
    //     timeOut: 2000
    //   });
    //   window.location.reload();
    // })
  }
  publier() {
    if (this.offreData.publier) {
      const now = new Date().toISOString();
      this.offre.updatePublier({ publier: this.offreData.publier, publicationDate: now }, this.idoffer).subscribe((res: any) => {
        this.toastr.success('Offre Publier', '', {
          timeOut: 4000
        });
        this.router.navigateByUrl('test');
      })
    }
    else {
      this.offre.updatePublier({ publier: this.offreData.publier }, this.idoffer).subscribe((res: any) => {
        this.toastr.success('Offre non Publié', '', {
          timeOut: 4000
        });
      })
    }

    // this.loading = true;
    // const now = new Date().toISOString();
    // const offer = {
    //   publier: true,
    //   publicationDate: now
    // }
    // this.offre.updatePublier(offer, this.idoffer).subscribe((res: any) => {
    //   console.log(res)
    //   this.loading = false;
    //   this.toastr.success('offre Publié', '', {
    //     timeOut: 2000
    //   });
    //   window.location.reload();
    // })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      this.idoffer = params.idOffer;
      await this.offre.getedetailOfferByUser(null, params.idOffer).subscribe((data: any) => {
        console.log(data)
        this.offreData = data.data;
        this.loading = true;
        let indexLogo = this.offreData.blobs?.findIndex(blob => (blob.TypeBlobId === 1));
        console.log(indexLogo);
        if (indexLogo > -1) {
          this.blobLogo = this.url + this.offreData.blobs[indexLogo].path;
        }
      });

    });
  }

  goToDashboard(offer_id) {
    this.router.navigateByUrl(`offre/${offer_id}/users`);
  }

  deleteOffre() {
    this.offre.deleteOffre(this.idoffer).subscribe(response => {
      console.log(response)
      if (response.error) {
        this.toastr.success(response.message, '', {
          timeOut: 4000
        });
      }
      else {
        this.toastr.error(response.message, '', {
          timeOut: 4000
        });
      }
    })
  }
}
