import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '../../../../src/app/services/offre.service';
import { UserService } from '../../../../src/app/services/user.service';
import { PostulationService } from '../../../../src/app/services/postulation.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-candidat',
  templateUrl: './menu-candidat.component.html',
  styleUrls: ['./menu-candidat.component.scss']
})
export class MenuCandidatComponent implements OnInit {

  slide: any;
  loading = false;
  offreData: any = [];
  idUser: any;
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  profileData: any;
  firstname: any;
  lastName: any;
  city: any;
  country: any;
  countryCode: any;
  currentJob: any;
  experienceYear: any;
  studiesLevel: any;
  diplomas: any;
  diplomasSpecialities: any;
  ville: any;
  numTel: any;
  metierActuel: any;
  anneesExperiences: any;
  niveauEtudes: any;
  diplomes: any;
  specialisations: any;
  id: any;
  canTest = false;
  haveOffer = false;
  public modalDeposer1: BsModalRef;
  public sectionSubject: Observable<any> = of([]);
  public idOffre: Observable<any> = of([]);
  constructor(
    private offre: OffreService,
    private userServ: UserService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private userS: UserService,
    private postulationS: PostulationService) {
    this.sectionSubject = this.userServ.getUser();
    this.sectionSubject.subscribe((data: any) => {
      this.currentSection = data;
      console.log(data)
    });
    this.idOffre = this.offre.getOffreId();
    this.idOffre.subscribe((data: any) => {
      console.log(data)
      this.idOffre = data;
    })
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;
    }
    if (this.idOffre) {
    	this.haveOffer = true;
    	this.postulationS.checktest({ 
    		userId: localStorage.getItem('idUser'), 
    		offreId: this.idOffre 
    	}).subscribe(response => {
      		if (response.data === 0) {
      			this.canTest = true;
      		}
    	}, error => {})
    }
  }

  postuler() {
    // vérifier si l'utilisateur a déjà fait le test
    this.postulationS.checktest({ 
    	userId: localStorage.getItem('idUser'), 
    	offreId: this.idOffre 
    }).subscribe(response => {
      if (response.data > 0) {
        this.toastr.error("Vous ne pouvez plus faire ce test", '', {
          timeOut: 2000
        });
      }
      else {
        this.router.navigate(['quiz/' + this.idOffre]);
      }
    }, error => {
      this.toastr.error(error.message, '', {
        timeOut: 4000
      });
    })
  }

  goTo() {
    this.router.navigate(['postuler/' + this.idOffre + '/fichedeposte']);
  }
  openModal(template: TemplateRef<any>) {
    this.modalDeposer1 = this.modalService.show(template,
      Object.assign({}, { size: 'lg', ignoreBackdropClick: true })
    );

    this.userS.getProfilData(localStorage.getItem('idUser')).subscribe((data: any) => {
      this.profileData = data;
      this.firstname = this.profileData.profile.firstName;
      this.lastName = this.profileData.profile.lastName;
      this.city = this.profileData.profile.ville;
      this.numTel = this.profileData.profile.numTel;
      this.country = this.profileData.profile.pays;
      this.currentJob = this.profileData.profile.metierActuel;
      this.experienceYear = this.profileData.profile.anneesExperiences;
      this.studiesLevel = this.profileData.profile.niveauEtudes;
      this.diplomas = this.profileData.profile.diplomes;
      this.diplomasSpecialities = this.profileData.profile.specialisations;
      console.log(this.firstname, this.lastName, this.profileData)
    })
  }
  updateProfile() {
    const profile = {
      firstName: this.firstname,
      lastName: this.lastName,
      ville: this.city,
      pays: this.country,
      numTel: this.numTel,
      metierActuel: this.currentJob,
      anneesExperiences: this.experienceYear,
      niveauEtudes: this.studiesLevel,
      diplomes: this.diplomas,
      specialisations: this.diplomasSpecialities,
      userId: this.idUser
    }
    console.log(profile);
    this.userS.updateprofile(profile).subscribe((response: any) => {
      console.log(response)
      if (response.error === false) {
        this.toastr.success('Votre profile a été mis à jour.', '', {
          timeOut: 2000
        });
        window.location.reload();
      } else {
        this.toastr.error('Erreur : ' + response.message, '', {
          timeOut: 4000
        });
      }
    });
  }
  logout() {
    localStorage.clear()
    window.location.reload();
  }
  testLater() {
    this.toastr.success('Votre profile a été enregistré. Vous pouvez faire le test plus tard', '', {
        timeOut: 3000
    });
    this.router.navigate(['/candidat/profile']);
  }
  ngOnInit(): void {
  }
}
