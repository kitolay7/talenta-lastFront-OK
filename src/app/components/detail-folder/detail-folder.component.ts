import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OffreService } from '../../services/offre.service';
import { UserService } from '../../services/user.service';
import { Toast, ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-detail-folder',
  templateUrl: './detail-folder.component.html',
  styleUrls: ['./detail-folder.component.scss']
})
export class DetailFolderComponent implements OnInit {
  title = "Details du dossier";
  loading = false;
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  public sectionSubject: Observable<any> = of([]);
  idUser: any;
  dataInfo: any;
  txt: any;
  constructor(
    private offreService: OffreService,
    private offreS: OffreService,
    private userServ: UserService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    const a = this.activatedRoute.snapshot.paramMap.get('idFolder');
    
    this.offreService.getOneFolder(a).subscribe((data: any) => {
      this.loading = true;
      this.dataInfo = data.data;
      console.log(this.dataInfo);
    })
  }
  remarque(a) {
    const rmq = {
      remarque: a,
      id: this.dataInfo.id
    }
    this.offreService.setRemarque(rmq).subscribe((res: any) => {
      if (res.error === false) {
        this.toastr.success('remarque ajouté', '', {
          timeOut: 2000
        });
        window.location.reload();
      } else {
        this.toastr.error('Une erreur est survenue', '', {
          timeOut: 2000
        });
      }
    });
  }

  republishedOffer(offerId, folderId, infoPublier){
    
    console.log("Offre ID : "+offerId+" - infoPublier : "+infoPublier);
    this.offreS.reUpdateOffreQuizzArchive(offerId, folderId, { publier: infoPublier}).subscribe(
      (response) => {
        this.toastr.success(`Offre reactivée`, '', {
          timeOut: 5000
        });
        this.router.navigateByUrl("/projet")
      },
      (error) => {
        this.toastr.error("Problème lors de la réactivation de l'offre !", '', {
          timeOut: 5000
        });
      }
    )
  }

  publier(idOffre: number, lastValue: boolean) {

    const now = new Date().toISOString();
    this.offreService.updatePublier({ publier: lastValue, publicationDate: (lastValue ? now : null) }, idOffre).subscribe((res: any) => {
      // this.folder[this.findIndexdossierById(id)].publier = lastValue;
      if (lastValue) {
        this.toastr.success(`Offre Publié`, '', {
          timeOut: 4000
        });
      }
      else {
        this.toastr.success(`Offre non Publié`, '', {
          timeOut: 4000
        });
      }
    })
  }

  archiver(idOffre: number, lastValue: boolean) {
    this.offreService.updateArchive({ archived: lastValue }, idOffre).subscribe((res: any) => {
      if (lastValue) {
        this.offreService.updatePublier({ publier: false }, idOffre).subscribe((res: any) => {
          this.dataInfo.offre.publier = false;
        })
        this.toastr.success('Offre Archivé', '', {
          timeOut: 4000
        });
      } else {
        this.toastr.success('Offre non Archivé', '', {
          timeOut: 4000
        });
      }
    })
  }
}
