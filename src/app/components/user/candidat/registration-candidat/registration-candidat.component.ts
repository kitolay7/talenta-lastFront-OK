import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { of, from } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { HelperService } from '../../../../services/helper.service';
import { Profile } from 'src/app/models/profile';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PostulationService } from 'src/app/services/postulation.service';
import { OffreService } from 'src/app/services/offre.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-registration-candidat',
  templateUrl: './registration-candidat.component.html',
  styleUrls: ['./registration-candidat.component.scss']
})
export class RegistrationCandidatComponent implements OnInit {
  formRegister: FormGroup;
  formLogin: FormGroup;
  email: string;
  password: string;
  mdp: string;
  hide = true;
  votreEmail: string;
  userId: string;
  isLoading = false;
  isCandidat = false;
  isRecruteur = true;
  public modalForgot: BsModalRef;
  public idOffre: Observable<any> = of([]);
  constructor(
    private formBuilder: FormBuilder,
    private userS: UserService,
    private toastr: ToastrService,
    private router: Router,
    private postulationService: PostulationService,
    private offre: OffreService,
    private modalService: BsModalService,
  ) {
    this.createformRegisterUserCandidat();
    this.createFormLogin();
    this.userId = localStorage.getItem('idUser');
    if (this.userId !== null) {
      this.router.navigateByUrl('/candidat/profile')
    }
  }

  ngOnInit(): void {
    this.idOffre = this.offre.getOffreId();
    this.idOffre.subscribe((data: any) => {
      console.log(data)
      this.idOffre = data;
    })
  }
  createFormLogin() {
    this.formLogin = new FormGroup({
      mailControl: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      pwControl: new FormControl('', [
        Validators.required,
      ]),
    });
  }
  createformRegisterUserCandidat() {
    this.formRegister = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        this.checkMail]),
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      pseudoFC: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      numTel: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      currentJob: new FormControl('', Validators.required),
      experienceYear: new FormControl('', Validators.required),
      studiesLevel: new FormControl('', Validators.required),
      diplomas: new FormControl('', Validators.required),
      diplomasSpecialities: new FormControl('', Validators.required),
      codeFC: new FormControl('', Validators.required),
      commFC: new FormControl('', Validators.required),
      acceptFC: new FormControl('', Validators.required),
    });
    
  }

  get f() {
    return this.formRegister.controls;
  }
  createUser() {
    this.isLoading = true;
    const data = {
      user: {
      	username: this.formRegister.controls.pseudoFC.value,
        email: this.formRegister.controls.email.value,
        password: this.formRegister.controls.password.value,
        roles: ['candidat']
      },

      // profile
      profile: {
        firstName: this.formRegister.controls.firstName.value,
        lastName: this.formRegister.controls.lastName.value,
        ville: this.formRegister.controls.city.value,
        pays: this.formRegister.controls.country.value,
        codePostal: this.formRegister.controls.codeFC.value,
        numTel: this.formRegister.controls.numTel.value,
        metierActuel: this.formRegister.controls.currentJob.value,
        anneesExperiences: this.formRegister.controls.experienceYear.value,
        niveauEtudes: this.formRegister.controls.studiesLevel.value,
        diplomes: this.formRegister.controls.diplomas.value,
        specialisations: this.formRegister.controls.diplomasSpecialities.value,
      }
    };
    const candidat = new User(data.user);
    const profile = new Profile(data.profile);

    // candidat.getData();
    // profile.getData();
    this.userS.register({ ...candidat, ...profile }).subscribe((response: any) => {
      if (response.error === false) {
        this.isLoading = false;
        this.formRegister.reset();
        this.toastr.success('Votre compte à été créer. Veuillez vérifier votre mail pour finaliser votre inscription.', '', {
          timeOut: 5000
        });
        this.router.navigateByUrl('/');

      } else {
        this.isLoading = false;
        this.toastr.error(response.message, '', {
          timeOut: 4000
        });
      }
    },
        err => {
          this.isLoading = false;
          this.toastr.error('Erreur de connexion', '', {
            timeOut: 5000
          });
          console.log(err)
        });
    // candidat.getData();
  }

  checkMail(controls) {
    const regExp = new RegExp(/\S+@\S+\.\S+/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkMail: true };
    }
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  public menuSubject: Observable<any> = of([]);
  menuList: any;
  profileMenu: any;

  loginAccount() {
    
    this.isLoading = true;
    const user = {
      email: this.formLogin.controls.mailControl.value,
      password: this.formLogin.controls.pwControl.value,
    };
    this.userS.login(user).subscribe((data: any) => {
    console.log(" Role current after login "+data.roles);
      if (data.error === false) {
        
    		if (data.roles[0].includes('ROLE_CANDIDAT')) {
          console.log(" Role candidat REGISTRATION : "+data.roles);
          this.isRecruteur = false;
            this.isCandidat = true;
            const profileMenu2 = [
        			{
          			item: 'Mon compte',
          			path: '/candidat/profile'
        			}
            ];
            this.userS.setProfileMenu(profileMenu2);
            this.formLogin.reset();
      			const data1 = [
              {
                name: 'Espace Candidat',
                mat: 'account_circle',
                path: '/candidat/profile'
              },
        			{
          			name: 'Se deconnecter',
          			mat: 'person_outline',
          			path: '/'
        			}
            ];
            this.userS.setMenu(data1);
      			
            console.log('Menu : '+data1.toString());
            //this.userS.setProfileMenu(profileMenu);
            this.isCandidat = true;
            
            //timeout:4000;
            
            this.menuSubject = this.userS.getMenu();
            this.menuSubject.subscribe((data1: any) => {
      //console.log(data);
              this.menuList = data1;
            });
            this.menuSubject = this.userS.getProfileMenu();
            this.menuSubject.subscribe((data1: any) => {
              //console.log(data);
            this.profileMenu = data1;
          });
      		this.router.navigateByUrl('/candidat/profile');	
      			//this.userS.setProfileMenu(profileMenu);
      			this.userS.storeUserData(data.id, data.accessToken)
      			this.toastr.success('Bienvenue  ' + (data.username || 'dans votre profil'), '', {
        			timeOut: 4000
            });
            //console.log('ProfileMenu : '+profileMenu);
            console.log('Profile menu before : '+this.userS.getProfileMenu.name);
            
            console.log('Profile menu after : '+this.userS.getProfileMenu.name);
            this.isLoading = false;
            //this.refresh()
            	this.postulationService.postule({ userId: parseInt(localStorage.getItem('idUser')), offreId: this.idOffre }).subscribe(response => {
            		console.log(response)
            		this.toastr.success(response.message, '', {
                    timeOut: 4000,
                    
            		});
            	}, error => {
                this.toastr.error(error.error.message === "Validation error" ? "Vous avez déjà postulé à cette offre" : error.error.message, "Veuillez lire les conditions de conformité", {
                  timeOut: 4000
              });
                /*
            		this.toastr.error(error.error.message === "Validation error" ? "Vous avez déjà postulé à cette offre" : error.error.message, 'Vous pouvez postuler à une offre', {
                		timeOut: 4000
                });
                */
            	})
              this.isLoading = false;
            } else {
      			this.toastr.error('Erreur de connexion', '', {
        			timeOut: 4000
      			});
            this.isLoading = false;
          }
          } else {
            this.toastr.error(data.error.message, 'Mot de passe invalide !!! ', {
              timeOut: 4000
            });
            this.isLoading = false;
            console.log(data)
          }
        },
        err => {
          this.isLoading = false;
          this.toastr.error(err.error.message, 'Erreur', {
            timeOut: 4000
          });
          console.log(err);
        });
  }
  
  	formForgetRecruteur = new FormGroup({
    	forgetFormControl: new FormControl('', [
      		Validators.required,
      		Validators.email,
    	]),
  	});
	
    refresh(): void {
      window.location.reload();
  }
    openForgot(template: TemplateRef<any>) {
    	this.modalForgot = this.modalService.show(template,
      		Object.assign({}, { 
      			class: 'forgotClass', 
      			size: 'lg', 
      			ignoreBackdropClick: true 
      		})
    	);
	}
  	sendForgot() {
    	this.isLoading = true;
    	const mail = {
      		email: this.formForgetRecruteur.controls.forgetFormControl.value,
    	};
    	this.userS.forgot(mail).subscribe((data: any) => {
      		console.log(data);
      		if (data.error === false) {
      			this.isLoading = false;
          		this.formForgetRecruteur.reset();
          		this.modalForgot.hide();
          		this.toastr.success('Cliquez sur le lien dans votre boite email pour réinitialiser votre mot de passe.', '', {
            		timeOut: 5000
          		});
      		} else {
        		this.isLoading = false;
        		this.toastr.error(data.message, '', {
          		timeOut: 5000
        		});
      		}
    	},
      	err => {
        	this.isLoading = false;
        	this.toastr.error('Erreur de connexion', '', {
          	timeOut: 5000
        	});
        	console.log(err)
      	});
  	}
  
  
}
