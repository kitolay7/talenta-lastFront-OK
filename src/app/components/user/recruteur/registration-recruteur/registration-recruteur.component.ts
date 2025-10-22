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
  selector: 'app-registration-recruteur',
  templateUrl: './registration-recruteur.component.html',
  styleUrls: ['./registration-recruteur.component.scss']
})
export class RegistrationRecruteurComponent implements OnInit {

  formRegister: FormGroup;
  formLogin: FormGroup;
  email: string;
  password: string;
  mdp: string;
  hide = true;
  votreEmail: string;
  userId: string;
  isLoading = false;
  public modalForgot: BsModalRef;
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
      this.router.navigateByUrl('/myaccount')
    }
  }

  ngOnInit(): void {
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
      enterpriseFC: new FormControl('', Validators.required),
      codeFC: new FormControl('', Validators.required),
      commFC: new FormControl('', Validators.required),
      acceptFC: new FormControl('', Validators.required),
    });

  }

  get f() {
    return this.formRegister.controls;
  }

  onChangeCpw() {
    HelperService.ConfirmedValidator('password', 'confirmpassword')
  }

  createUser() {
    const data = {
      user: {
        username: this.formRegister.controls.pseudoFC.value,
        email: this.formRegister.controls.email.value,
        password: this.formRegister.controls.password.value,
        roles: ['recruteur']
      },

      // profile
      profile: {
        firstName: this.formRegister.controls.firstName.value,
        lastName: this.formRegister.controls.lastName.value,
        pays: this.formRegister.controls.country.value,
        numTel: this.formRegister.controls.numTel.value,
        societe: this.formRegister.controls.enterpriseFC.value,
        codePostal: this.formRegister.controls.codeFC.value,
      }
    };


    const recruteur = new User(data.user);
    const profile = new Profile(data.profile);

    this.userS.register({ ...recruteur, ...profile }).subscribe((response: any) => {
      if (response.error === false) {
        this.toastr.success('Votre compte à été créer. Veuillez vérifier votre mail pour finaliser votre inscription.', '', {
          timeOut: 5000
        });

      } else {
        this.toastr.error(response.message, '', {
          timeOut: 4000
        });
      }
    });
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
  loginAccount() {
    const user = {
      email: this.formLogin.controls.mailControl.value,
      password: this.formLogin.controls.pwControl.value,
    };
    this.userS.login(user).subscribe((data: any) => {
      if (data.error === false) {
        if (data.roles.includes('ROLE_RECRUTEUR')) {
          if (data.email.includes('talenta@recrutement.mg')) {
            this.userS.storeUserData(data.id, data.accessToken)
            const menu = [
              {
                name: 'Candidature Spontanée',
                mat: 'content_paste',
                path: '/listingSpontaneous'
              },
              {
                name: 'Banque CV',
                mat: 'folder',
                path: '/banqueCV'
              },
              {
                name: 'Se deconnecter',
                mat: 'person_outline',
                path: '/'
              }
            ];
            this.userS.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace Talenta',
                path: '/myaccount'
              }
            ];
            this.userS.setProfileMenu(profileMenu);
            this.router.navigateByUrl('/myaccount');
            window.location.reload();
            this.toastr.success('Bienvenue  ' + data.username, '', {
              timeOut: 5000
            });
          } else {
            this.userS.storeUserData(data.id, data.accessToken)
            const menu = [
              {
                name: 'Ajout offre',
                mat: 'content_paste',
                path: '/ajout-offre'
              },
              {
                name: 'Créer un nouveau test',
                mat: 'library_add',
                path: '/create-test'
              },
              {
                name: 'Test en cours',
                mat: 'text_snippet',
                path: '/test'
              },
              {
                name: 'Projet',
                mat: 'folder',
                path: '/projet'
              },

              {
                name: 'Archive',
                mat: 'topic',
                path: '/myaccount'
              },
              {
                name: 'Les Candidats',
                mat: 'assignment_ind',
                path: '/gestion_candidats'
              },
              {
                name: 'Se deconnecter',
                mat: 'person_outline',
                path: '/'
              }
            ];
            this.userS.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace recruteur',
                path: '/myaccount'
              }
            ];
            this.userS.setProfileMenu(profileMenu);
            this.router.navigateByUrl('/myaccount');
            this.toastr.success('Bienvenue  ' + data.username, '', {
              timeOut: 5000
            });

          }
        } else {
          this.toastr.error('Il faut avoir un compte recruteur pour pouvoir se connecter', '', {
            timeOut: 5000
          });
        }
      } else {
        this.toastr.error(data.error.message, '', {
          timeOut: 2000
        });
        console.log(data)
      }
    },
      err => {
        this.toastr.error(err.error.message, '', {
          timeOut: 2000
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
