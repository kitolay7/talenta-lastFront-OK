import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { from, of } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { Profile } from '../../../models/profile';
import { OffreService } from 'src/app/services/offre.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-form-candidat',
  templateUrl: './profile-form-candidat.component.html',
  styleUrls: ['./profile-form-candidat.component.scss']
})
export class ProfileFormCandidatComponent implements OnInit {
	
	
  idO: any;
  isCandidat = false;
  formRegister: FormGroup;
  userId: string;
  profileData: any;
  spinner = false;
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
  isReadonly = true;
  formData: FormData = new FormData();
  idU: any;
  nomSociete: any;
  socityId: any;
  public idUser: Observable<any> = of([]);
  public idOffre: Observable<any> = of([]);
  email: any;
  constructor(
    private userS: UserService,
    private router: Router,
    private offreS: OffreService,
    private toastr: ToastrService,) {
    this.idUser = this.userS.getUser();
    this.idUser.subscribe((data: any) => {
      this.idUser = data;
    })

    console.log('Constructeur YES ...');    

    const profileMenu = [
      {
        item: 'Mon compte',
        path: '/candidat/profile'
      }
    ];
    this.userS.setProfileMenu(profileMenu);

    document.getElementById('menu_list').textContent = 'Mon compte'; 
    document.getElementById('connect_candidat').style.visibility = 'hidden';

    this.idOffre = this.offreS.getOffreId();
    this.idOffre.subscribe((data: any) => {
      	this.idOffre = data;
      	console.log(this.idOffre)
    	if (this.idOffre) {
    		this.offreS.getedetailOfferByUser('', this.idOffre).subscribe((data: any) => {
        		this.socityId = data.data.userId;
      			console.log(data.data)
        		
    			this.userS.getProfilData(this.socityId).subscribe((data: any) => {
        			this.nomSociete = data.societe;
      			});
      		});
    	}
    })
  }
  postuler() {
    this.router.navigate(['quiz/' + this.idOffre]);
  }
  goTo() {
    this.router.navigate(['postuler/' + this.idOffre + '/fichedeposte']);
  }
  editForm() {
    this.isReadonly = !this.isReadonly;
  }
  readonlyChange($event) {
  	this.isReadonly = $event;
  	console.log(this.isReadonly);
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
      userId: this.idU
    }
    console.log(profile);
    this.userS.updateprofile(profile).subscribe((response: any) => {
      console.log(response)
      if (response.error === false) {
        this.toastr.success('Votre profile a été mis à jour.', '', {
          timeOut: 2000
        });

      } else {
        this.toastr.error('Erreur : ' + response.message, '', {
          timeOut: 4000
        });
      }
    });
  }

refresh(): void {
    window.location.reload();
}
  
openConformite(): void{
    window.open("assets/docs/conformite-RGPD.pdf","_blank");
}
  ngOnInit(): void {
    //this.refresh();
    this.isCandidat = true;
  	this.spinner = false;
    this.idU = localStorage.getItem('idUser');
    const profileMenu = [
      {
        item: 'Mon compte',
        path: '/candidat/profile'
      }
    ];
    this.userS.setProfileMenu(profileMenu);
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
      this.email= this.profileData.email;
      this.spinner = true;
      console.log('DATA : '+this.firstname, this.lastName, this.profileData, this.isCandidat);
    })
  }
}
