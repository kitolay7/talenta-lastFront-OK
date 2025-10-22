import { Component, OnInit, TemplateRef, HostListener, ViewChild, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ErrorStateMatcher } from '@angular/material/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, Event, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';
import { OffreService } from '../../services/offre.service';
import { PostulationService } from '../../services/postulation.service';
import { Offres } from '../../models/offres';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  villeControl: any;
  currentUserSubject: BehaviorSubject<any>;
  postul = true;

  

  formData: FormData = new FormData();

  constructor(
    private socket: Socket,
    public breakpointObserver: BreakpointObserver,
    private modalService: BsModalService,
    private userServ: UserService,
    private toastr: ToastrService,
    private router: Router,
    private dataServ: DataService,
    private formBuilder: FormBuilder,
    private location: Location,
    private offreService: OffreService,
    private postulationService: PostulationService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {

    this.createformRegister();
    
    if (this.breakpointObserver.isMatched('(max-width: 767px)')) {
      this.isSmallScreen = true;
    } else { this.isSmallScreen = false; }

    // this.createformRegisterRecruteur();
    this.sectionSubject = this.userServ.getSection();
    this.sectionSubject.subscribe((data: any) => {
      this.currentSection = data;
    });

    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('Token'));
    if (this.currentUserSubject.getValue() !== null) {
      // tslint:disable-next-line: max-line-length
      this.userServ.getProfilData(localStorage.getItem('idUser')).subscribe((data: any) => {
        
        if (data.roles.includes('ROLE_RECRUTEUR')) {
          if (data.email.includes('talenta@recrutement.mg')) {
            this.isTalenta = true;
            this.postul = false;
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
                path: '/home'
              }
            ];
            this.userServ.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace Talenta',
                path: '/myaccount'
              }
            ];
            this.userServ.setProfileMenu(profileMenu);
          } else {
            this.postul = false;
            this.isRecruteur = true;            
            const menu = [
              {
                name: 'Profil',
                mat: 'person_outline',
                path: '/user/recruteur/profile'
              },
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
                path: '/listingArchiver'
              },
              {
                name: 'Les Candidats',
                mat: 'assignment_ind',
                path: '/gestion_candidats'
              },
              {
                name: 'Se deconnecter',
                //mat: 'person_outline',
                mat: 'exit_to_app',
                path: '/home'
              }
            ];
            this.userServ.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace recruteur',
                path: '/myaccount'
              }
            ];
            this.userServ.setProfileMenu(profileMenu);

          }
        } else if (data.roles.includes('ROLE_CANDIDAT')) {
          console.log('Role CANDIDAT 1 HEADER');
          this.isRecruteur = false; 
          this.isCandidat = true;
          const data = [
            {
              name: 'Espace Candidat',
              mat: 'account_circle',
              path: '/candidat/profile'
            },
            {
              name: 'Se deconnecter',
              mat: 'person_outline',
              path: '/home'
            }
          ];
          this.userServ.setMenu(data);
          const profileMenu = [
            {
              item: 'Mon compte',
              path: '/candidat/profile'
            }
          ];
          this.userServ.setProfileMenu(profileMenu);
        } else {
          const data = [{
            name: 'Se connecter',
            mat: 'account_circle',
            path: ''
          }];
          this.userServ.setMenu(data);
          const profileMenu = [
            {
              item: 'Espace recruteur',
              path: '/myaccount'
            }
          ];
          this.userServ.setProfileMenu(profileMenu);
        }
      })

    } else {

      const data = [{
        name: 'Se connecter',
        mat: 'account_circle',
        path: ''
      }];
      this.userServ.setMenu(data);
      const profileMenu = [
        {
          item: 'Espace recruteur',
          path: '/myaccount'
        }
      ];
      this.userServ.setProfileMenu(profileMenu);
    }


    this.menuSubject = this.userServ.getMenu();
    this.menuSubject.subscribe((data: any) => {
      //console.log(data);
      this.menuList = data;
    });
    this.menuSubject = this.userServ.getProfileMenu();
    this.menuSubject.subscribe((data: any) => {
      //console.log(data);
      this.profileMenu = data;
    });

    this.location.onUrlChange(x => {
      this.checkHome(x);
      this.checkCandidat(x);
      this.checkRecruteur(x);
      if (this.breakpointObserver.isMatched('(max-width: 767px)')) {
        this.isSmallScreen = true;
      } else { this.isSmallScreen = false; }
    });
    // chips

    this.filteredCompetences = this.competenceCtrl.valueChanges.pipe(
      startWith(null),
      map((competence: string | null) => competence ? this._filter(competence) : this.allCompetences.slice()));
  }

  isCandidat = false;
  isRecruteur = false;
  isTalenta = false;
  profileMenu: any;

  url = environment.baseUrl;

  sectionHome = 'main-banner';

  isLoading = false;

  checkHome(x) {
    //console.log(x);
    this.isHome = (x === '/') ? true : false;
  }
  checkCandidat(x) {
    if (x === '/#/candidat/profile') {
      this.isCandidat = true;
    }
  }
  checkRecruteur(x) {
    if (x === '/myaccount') {
      this.isRecruteur = true;
    }
  }
  isHome = true;


  secteurs = [
    "",
    "Biologie / chimie / Sciences",
    "Commercial / Vente",
    "Confection / Artisan",
    "Conseiller client / Call center",
    "Consultant / Enquêteur",
    "Droit / Juriste",
    "Enseignement",
    "Evénementiel",
    "Gestion / Comptabilité / Finance",
    "Humanitaire / Social",
    "Import / Export",
    "Informatique / web",
    "Ingénierie / industrie / BTP",
    "Journalisme / Langue / Interprète",
    "Logistique / Achats",
    "Main d'oeuvre / Ménage / Chauffeur",
    "Maintenance / Mécanique",
    "Management / RH",
    "Marketing / Communication",
    "Medecine / Santé",
    "Mode / beauté",
    "Qualité / Normes",
    "Réception / Accueil / Standard",
    "Rédaction / Saisie / Offshore",
    "Responsable / Direction / Administration",
    "Restauration / hôtellerie",
    "Sécrétariat / Assistanat",
    "Securité",
    "Télé-vente / Prospection / Enquête",
    "Télécommunication",
    "Tourisme / Voyage"
  ];


  firstName: any;
  lastName: any;
  birthday: any;
  email: any;
  numTel: any;
  idSkype: any;
  idWhatsapp: any;
  originCountry: any;
  actualCountry: any;
  actualCity: any;
  secteur: any;


  // ******************* Modal LOGIN *******************


  // Check password

  // getting the form control elements
  get password1(): AbstractControl {
    return this.formRegisterRecruteur.controls.mdpFC.value;
  }

  get confpassword1(): AbstractControl {
    return this.formRegisterRecruteur.controls.confirmFC.value;
  }

  pwOK = false;

  onChangeCpw() {
    this.pwOK = (this.password1 === this.confpassword1) ? true : false;
  }
  // tslint:disable-next-line: typedef
  checkCpw = (this.pwOK) ? false : true;

  country = ['Madagascar', 'Canada', 'France'];

  public menuSubject: Observable<any> = of([]);
  public isMenuCollapsed = true;


  hide = true;
  mdp: any;
  confirmMdp: any;
  hideControl = new FormControl(false);

  formLoginRecruteur = new FormGroup({
    mailControl: new FormControl('', [
      Validators.required,
    ]),
    pwControl: new FormControl('', [
      Validators.required,
    ]),
  });

  formForgetRecruteur = new FormGroup({
    forgetFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  });

  formRegisterRecruteur = new FormGroup({

    pseudoFC: new FormControl('', [
      Validators.required,
    ]),
    emailFC: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    mdpFC: new FormControl('', [
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')
    ]),
    confirmFC: new FormControl('', [
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')
    ]),
    telFC: new FormControl('', [
      Validators.required,
      this.checkTel
    ]),
    enterpriseFC: new FormControl('', [
      Validators.required,
    ]),
    codeFC: new FormControl('', [
      Validators.required,
      this.checkCode
    ]),
    paysFC: new FormControl('', [
      Validators.required,
    ]),
    commFC: new FormControl('', []),
    acceptFC: new FormControl('', [
      Validators.requiredTrue,
    ]),
  });
  sousMenu = '';

  lieu = 'Antananarivo';
  public modalOffre1: BsModalRef;
  public bsModalRef1: BsModalRef;
  public modalRef2: BsModalRef;
  public modalDeposer1: BsModalRef;
  public modalOffre: BsModalRef;
  public modalPostuler: BsModalRef;
  public modalDeposer: BsModalRef;
  public modalRef: BsModalRef;

  menuList: any;
  public isSmallScreen = false;


  public isDropdowned = false;
  public isDropdowned1 = false;


  // tslint:disable-next-line: typedef
  checkTel(controls) {
    const regExp = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkTel: true };
    }
  }
  // tslint:disable-next-line: typedef
  checkCode(controls) {
    const regExp = new RegExp(/^[-\s\./0-9]{1,5}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkCode: true };
    }
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleActive() {
    this.isDropdowned1 = false;
    this.isDropdowned = !this.isDropdowned;
  }
  toggleActive1() {
    this.isDropdowned = false;
    this.isDropdowned1 = !this.isDropdowned1;
  }

  ngOnInit(): void {

    
    this.dataServ.getAllPays().subscribe((res: any) => {
      this.countries = res;
    });

    this.isLoading = false;

  }
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  clickAbout() { 
    this.router.navigate(['/about']);
    this.isMenuCollapsed = true;
  }

  clickTestimonial() {
    if (this.isHome) {
      this.scrollTo('testimonial');
    }
    else {
      this.userServ.setSection('testimonial');
      this.router.navigate(['/'], { fragment: 'testimonial' })
    }
  }

  clickService() {
    if (this.isHome) {
      this.scrollTo('service');
    }
    else {
      this.userServ.setSection('service');
      this.router.navigate(['/'], { fragment: 'service' })
    }
  }

  clickOffre() {
    if (this.isSmallScreen) {
      this.toggleActive();
    }
    else {
      if (this.isHome) {
        this.scrollTo('offre');
      }
      else {
        this.userServ.setSection('offre');
        this.router.navigate(['/'], { fragment: 'offre' })
      }
    }
  }

  clickRecrutement() {
    if (this.isSmallScreen) {
      this.toggleActive1();
    }
    else {
      if (localStorage.getItem('idUser') !== null) {
        this.userServ.getProfilData(localStorage.getItem('idUser')).subscribe((data: any) => {
          if (data.roles.includes('ROLE_RECRUTEUR')) {
              this.router.navigateByUrl('/myaccount');
          } else if (data.roles.includes('ROLE_CANDIDAT')) {
              this.router.navigateByUrl('/candidat/profile');
          }
        })
      }
    }


  }


  selectTab(tabId: number, staticTabs: TabsetComponent) {
    //console.log(staticTabs);
    staticTabs.tabs[tabId].active = true;
  }


  // tslint:disable-next-line: typedef
  createAccount(staticTabs: TabsetComponent) {
    this.isLoading = true;
    const recruteur = {
      username: this.formRegisterRecruteur.controls.pseudoFC.value,
      email: this.formRegisterRecruteur.controls.emailFC.value,
      tel: this.formRegisterRecruteur.controls.telFC.value,
      societe: this.formRegisterRecruteur.controls.enterpriseFC.value,
      codePostal: this.formRegisterRecruteur.controls.codeFC.value,
      pays: this.formRegisterRecruteur.controls.paysFC.value,
      password: this.formRegisterRecruteur.controls.mdpFC.value,
      roles: [this.roleCreate]
    };
    //console.log(recruteur)
    this.userServ.register(recruteur).subscribe((data: any) => {
      if (data.error === false) {
        this.toastr.success('Votre compte à été créer. Veuillez vérifier votre mail pour finaliser votre inscription.', '', {
          timeOut: 5000
        });
        this.formRegisterRecruteur.reset();
        this.isLoading = false;
        this.selectTab(0, staticTabs);
      } else {
        this.isLoading = false;
        this.toastr.error(data.message, '', {
          timeOut: 5000
        });
      }

    },
      err => {
        console.log(err)
        this.isLoading = false;
        this.toastr.error('Erreur de connexion', '', {
          timeOut: 4000
        });
      });
  }

  loginAccount() {
    this.isLoading = true;
    const user = {
      email: this.formLoginRecruteur.controls.mailControl.value,
      password: this.formLoginRecruteur.controls.pwControl.value,
    };
    this.userServ.login(user).subscribe((data: any) => {
      console.log(data);
      if (data.error === false) {
        if (data.roles.includes('ROLE_RECRUTEUR')) {
          if (data.email.includes('talenta@recrutement.mg')) {
            this.isTalenta = true;
            this.userServ.storeUserData(data.id, data.accessToken)
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
                path: '/home'
              }
            ];
            this.userServ.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace Talenta',
                path: '/myaccount'
              }
            ];
            this.userServ.setProfileMenu(profileMenu);
            this.formLoginRecruteur.reset();
            this.isLoading = false;
            this.modalRef.hide();
            this.router.navigateByUrl('/myaccount');
            this.toastr.success('Bienvenue  ' + data.username, '', {
              timeOut: 5000
            });
          } else {
            this.isRecruteur = true;
            this.userServ.storeUserData(data.id, data.accessToken)
            const menu = [
              {
                name: 'Profil',
                mat: 'person_outline',
                path: '/user/recruteur/profile'
              },
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
                path: '/listingArchiver'
              },
              {
                name: 'Les Candidats',
                mat: 'assignment_ind',
                path: '/gestion_candidats'
              },
              {
                name: 'Se deconnecter',
                mat: 'exit_to_app',
                path: '/home'
              }
            ];
            this.userServ.setMenu(menu);
            const profileMenu = [
              {
                item: 'Espace recruteur',
                path: '/myaccount'
              }
            ];
            this.userServ.setProfileMenu(profileMenu);
            this.formLoginRecruteur.reset();
            this.isLoading = false;
            this.modalRef.hide();
            this.router.navigateByUrl('/myaccount');
            this.toastr.success('Bienvenue  ' + data.username, '', {
              timeOut: 5000
            });

          }
        } else {
          this.formLoginRecruteur.reset();
          this.modalRef.hide();
          this.isLoading = false;
          this.toastr.error('Il faut avoir un compte recruteur pour pouvoir se connecter', '', {
            timeOut: 5000
          });
        }
      } else {
        this.isLoading = false;
        this.toastr.error(data.error.message, 'Mot de passe invalide', {
          timeOut: 5000
        });
        console.log(data)
      }
    },
      err => {
        this.isLoading = false;
        this.toastr.error(err.error.message, '', {
          timeOut: 5000
        });
        console.log(err)
      });
  }


  sendForgot() {
    this.isLoading = true;
    const mail = {
      email: this.formForgetRecruteur.controls.forgetFormControl.value,
    };
    this.userServ.forgot(mail).subscribe((data: any) => {
      console.log(data);
      if (data.error === false) {
        this.isLoading = false;
        this.formForgetRecruteur.reset();
        this.modalRef.hide();
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
        this.toastr.error(err.error.message, '', {
          timeOut: 5000
        });
        console.log(err)
      });
  }

  // ******************* Modal LOGIN FIN *******************


  roleCreate: string;

  scrollTo(section) {
    this.currentSection = section;
    this.userServ.setSection(section);
    document.getElementById(section).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openModal(template: TemplateRef<any>, role: string) {
    this.isDropdowned = false;
    this.isDropdowned1 = false;
    this.isMenuCollapsed = true;
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'loginRecClass', ignoreBackdropClick: true })
    );
    this.roleCreate = role;
    //console.log(this.roleCreate);
    this.formLoginRecruteur.reset();
    this.formRegisterRecruteur.reset();
    this.formForgetRecruteur.reset();
  }


  seeModal1(template: TemplateRef<any>, lieu: string) {
    this.isDropdowned = false;
    this.isDropdowned1 = false;
    this.isMenuCollapsed = true;
    this.lieu = lieu;

    this.offreService.geteOfferByPays(lieu).subscribe(data => {
      console.log(data)
      this.posts = data;
      //console.log(this.posts)
      if (localStorage.getItem('idUser')) {
        for (let indexOffer = 0; indexOffer < this.posts.length; indexOffer++) {
          for (let indexUserPostuled = 0; indexUserPostuled < this.posts[indexOffer].offer_postuled.length; indexUserPostuled++) {
            if (this.posts[indexOffer].offer_postuled[indexUserPostuled].id === parseInt(localStorage.getItem('idUser'))) {
              this.posts[indexOffer].postuled = true;
              break;
            }
          }
        }
      }
    });

    this.modalOffre1 = this.modalService.show(template,
      Object.assign({}, { class: 'offreClass', size: 'lg' })
    );
  }
  closeOffre() {
    this.modalOffre1.hide();
  }

  openDeposer(template: TemplateRef<any>) {
    this.isDropdowned = false;
    this.isDropdowned1 = false;
    this.isMenuCollapsed = true;
    this.resetDeposer();
    this.modalDeposer1 = this.modalService.show(template,
      Object.assign({}, { class: 'deposerClass', size: 'lg', ignoreBackdropClick: true })
    );
  }
  goTo(path, b) {
    if (path.includes('candidat/registration')) {
      console.log(b.id)
      if (localStorage.getItem('idUser') === null) {
        this.offreService.setOffre(b.id);
        this.router.navigateByUrl('candidat/registration');
        this.closeOffre();
      } else {
        this.offreService.setOffre(b.id);
        console.log(b.id)
        this.postulationService.postule({ userId: parseInt(localStorage.getItem('idUser')), offreId: b.id }).subscribe(response => {
          console.log(response)

          this.toastr.success(response.message, '', {
            timeOut: 2000
          });
          this.router.navigateByUrl(path);
          this.closeOffre();
        }, error => {

          this.toastr.error(error.error.message === "Validation error" ? "Vous avez déjà postulé à cette offre" : error.error.message, '', {
            timeOut: 4000
          });
        })
      }

    } else {

      this.offreService.setOffre(b.id);
      this.router.navigateByUrl(path);
      this.closeOffre()
    }
  }
  goToURL(a, template) {
    if (a.name.includes('Se connecter')) {
      this.openModal(template, 'recruteur');
      this.sousMenu = 'active';
    } else if (a.name.includes('deconnecter')) {
      this.isLoading = true;
      localStorage.clear();
      const data = [{
        name: 'Se connecter',
        mat: 'account_circle'
      }];
      this.userServ.setMenu(data);
      this.isRecruteur = false;
      this.isCandidat = false;
      this.isTalenta = false;
      window.location.assign('/');
      //window.location.reload();
    }
    else {
      this.router.navigateByUrl(a.path);
      this.isDropdowned = false;
      this.isDropdowned1 = false;
      this.isMenuCollapsed = true;
    }
  }


  // Offre modal


  posts: Offres[] = [];
  term: any;
  term2: any;
  p: any;
  recherche: any;

  voirPlus() {
    this.router.navigateByUrl('/detail-offres');
    this.modalOffre1.hide();
  }
  detailOffre(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(
      template,
      Object.assign({}, { class: 'loginClass', ignoreBackdropClick: true })
    );
    this.modalOffre1.hide();
  }


  // Postuler Login

  newsCustomer = false;
  formRegister: FormGroup;
  newClass = 'activModal';
  accountClass = '';
  newsCustomerBtn() {
    if (this.newsCustomer === false) {
      this.newsCustomer = true;
      this.newClass = '';
      this.accountClass = 'activModal';
    } else if (this.newsCustomer === true) {
      this.newsCustomer = false;
      this.newClass = 'activModal';
      this.accountClass = '';
    }
  }
  // tslint:disable-next-line: typedef
  createformRegister() {
    this.formRegister = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        this.checkMail
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])],
      confpassword: ['', Validators.compose([
        Validators.required,
      ])],
    });
  }
  // tslint:disable-next-line: typedef
  checkMail(controls) {
    const regExp = new RegExp(/\S+@\S+\.\S+/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkMail: true };
    }
  }





  // modalDeposer Candidature spontanée

  countries = [];
  villes = ['Antananarivo', 'Paris', 'Quebec'];

  currentSection: any;
  spiedTags = [];
  public sectionSubject: Observable<any> = of([]);


  // chips

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  competenceCtrl = new FormControl();
  filteredCompetences: Observable<string[]>;
  competences: string[] = [];
  allCompetences: string[] = ['Word', 'Excel', 'HTML', 'JavaScript', 'Communication', 'Community Management', 'Français', 'Anglais', 'Malagasy', 'Espagnol', 'Gestion de stress', 'Sens de relation client', 'Travail en équipe', 'A l’aise avec les chiffres', 'Force de propositions', 'Créativité', 'Adaptation', 'Sens de priorisation des tâches', 'Capacité d’adaptation', 'Autonomie', 'Rédaction de rapports', 'Gestion de projet', 'Normes ISO', 'DMAIC', 'Lean 6 sigma', '5S', 'PHP'];

  @ViewChild('competenceInput') competenceInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // education

  educations = [];

  // profession

  profession = [];

  // formulaire

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

  // chips

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our competence
    if ((value || '').trim() && this.competences.length < 5) {
      this.competences.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.competenceCtrl.setValue(null);
  }

  remove(competence: string): void {
    const index = this.competences.indexOf(competence);

    if (index >= 0) {
      this.competences.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // Add our competence
    if (this.competences.length < 5) {
      this.competences.push(event.option.viewValue);
      //this.competenceInput.nativeElement.value = '';
      this.competenceCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCompetences.filter(competence => competence.toLowerCase().indexOf(filterValue) === 0);
  }

  // educations

  @ViewChild('educForm') educForm: NgForm;

  insertionEduc(eductitre, educspecialisation, educdiplome, educstartDate, educendDate) {
    let educTitre = eductitre.value;
    let educSpecialisation = educspecialisation.value;
    let educDiplome = educdiplome.value;
    let educStartDate = educstartDate.value;
    let educEndDate = educendDate.value;

    let educ = {
      titre: educTitre,
      specialisation: educSpecialisation,
      diplome: educDiplome,
      startDate: educStartDate,
      endDate: educEndDate
    };

    this.educations = [...this.educations, educ];

    // Reset
    eductitre.value = '';
    educspecialisation.value = '';
    educdiplome.value = '';
    educstartDate.value = '';
    educendDate.value = '';

  }
  deleteEduc(i) {
    this.educations.splice(i, 1);
  }



  // profession

  @ViewChild('profForm') profForm: NgForm;

  insertionProf(titre: any, nom_soc: any, resume: any, startDate: any, endDate: any) {
    let profTitre = titre.value;
    let profNom_soc = nom_soc.value;
    let profResume = resume.value;
    let profStartDate = startDate.value;
    let profEndDate = endDate.value;

    let prof = {
      titre: profTitre,
      nomSociete: profNom_soc,
      resume: profResume,
      startDate: profStartDate,
      endDate: profEndDate
    };

    this.profession = [...this.profession, prof];

    // Reset
    titre.value = '';
    nom_soc.value = '';
    resume.value = '';
    startDate.value = '';
    endDate.value = '';

  }
  deleteProf(i) {
    this.profession.splice(i - 1, 1);
  }


  // DEPOSER

  deposerCand() {

    this.isLoading = true;
    this.formData.set('firstName', (this.firstName || ''));
    this.formData.set('lastName', (this.lastName || ''));
    this.formData.set('birthday', (this.birthday || ''));
    this.formData.set('email', (this.email || ''));
    this.formData.set('numTel', (this.numTel || ''));
    this.formData.set('idSkype', (this.idSkype || ''));
    this.formData.set('idWhatsapp', (this.idWhatsapp || ''));
    this.formData.set('originCountry', (this.originCountry || 'true'));
    this.formData.set('actualCountry', (this.actualCountry || ''));
    this.formData.set('actualCity', (this.actualCity || ''));
    this.formData.set('secteur', (this.secteur || ''));
    this.formData.set('competence', JSON.stringify(this.competences || []));
    this.formData.set('education', JSON.stringify(this.educations || []));
    this.formData.set('profession', JSON.stringify(this.profession || []));
    this.userServ.createSpontaneous(this.formData).subscribe((data: any) => {
      if (data.error === false) {
        this.isLoading = false;
        this.toastr.success('Votre dossier a été déposé. On vous contactera pour las suite.', '', {
          timeOut: 5000
        });
        this.canSend = false;
        this.resetDeposer();
        this.modalDeposer1.hide();
      } else {
        this.isLoading = false;
        this.toastr.error(data.message, '', {
          timeOut: 5000
        });
        this.canSend = false;
      }

    },
      err => {
        console.log(err)
        this.isLoading = false;
        this.toastr.error(err.message, '', {
          timeOut: 5000
        });
        this.canSend = false;
      });

  }
  cvU: string;
  cv: any;
  progressFile: any;

  onSelectedFile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.cvU = event.target.files[0];
      const reader = new FileReader();
      reader.onprogress = (evt: any) => {
        if (evt.lengthComputable) {
          this.progressFile = Math.round((evt.loaded / evt.total) * 100);
        }
      };
      reader.onload = (e: any) => {
        this.progressFile = 100;
        this.cv = e.target.result;
        setTimeout(() => { this.progressFile = 0 }, 2000);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.formData.set('cv', file, file.name);
    }
  }

  generatePdf(action: string, resume: any) {
    const documentDefinition = this.getDocumentDefinition(resume);
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      case 'send':
        pdfMake.createPdf(documentDefinition).getBlob((blob) => {
          const file = new File([blob],
            `Infos-${resume.firstName}-${resume.lastName}.pdf`,
            { type: 'application/pdf' }
          );
          this.formData.set('infos', file, `Infos-${resume.firstName}-${resume.lastName}.pdf`);
        });
        break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinition(resume: any) {
    sessionStorage.setItem('resume', JSON.stringify(resume));
    return {
      content: [
        {
          text: 'CANDIDATURE SPONTANEE',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Informations générales',
          style: 'header'
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'headerTitle',
        },
        {
          text: 'Prénom',
          style: 'headerSubTitle'
        },
        {
          text: resume.firstName          
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Nom',
          style: 'headerSubTitle'
        },
        {
          text: resume.lastName          
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: `Date de naissance : `,
          style: 'headerSubTitle'
        },
        {
          text: `${resume.birthday.toLocaleDateString('fr-FR')}`
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Email',
          style: 'headerSubTitle'
        },
        {
            text: resume.email
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Numero de téléphone',
          style: 'headerSubTitle'
        },
        {
          text: resume.numTel
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Id Skype',
          style: 'headerSubTitle'
        },
        {
          text: resume.idSkype
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Id Whatsapp',
          style: 'headerSubTitle'
        },
        {
          text: resume.idWhatsapp
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: `Voyage hors du pays d'origine`,
          style: 'headerSubTitle'
        },
        {
          text: `${(resume.originCountry === 'true' ? 'Oui' : 'Non')}`
        },
        {
          text:'',
          style: 'nextTitle'
        },
        {
          text: 'Localisation',
          style: 'header'
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'headerTitle',
        },
        {
          text: 'Pays actuel',
          style: 'headerSubTitle'
        },
        {
          text: resume.actualCountry
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Ville actuel',
          style: 'headerSubTitle'
        },
        {
          text: resume.actualCity
        },
        {
          text:'',
          style: 'nextTitle'
        },
        {
          text: 'Profil du candidat',
          style: 'header'
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'headerTitle',
        },
        {
          text: 'Secteur',
          style: 'headerSubTitle'
        },
        {
          text:  resume.secteur
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'titleSubLine'
        },
        {
          text: 'Compétences',
          style: 'headerSubTitle'
        },
        {
          columns: [
            {
              ul: resume.competence.map(s => s)
            },
          ]
        },
        {
          text:'',
          style: 'nextTitle'
        },
        {
          text: 'Détails éducatifs',
          style: 'header'
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'headerTitle',
        },
        {
          text: 'Institut / Ecole',
          style: 'headerSubTitle'
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              columns: [
                resume.education.map(ed => {
                  return [
                    {
                      text: `Nom, Addresse, Pays de l'Institut/ Ecole `,
                      style: 'eduStyle'
                    },
                    {
                      text: `${ed.titre}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Spécialisation`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${ed.specialisation}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Diplôme`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${ed.diplome}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Durée`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${ed.startDate} à ${ed.endDate}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `-------------------------------------------`,
                      alignment: 'center',
                      style: 'eduLine'
                    },
                  ]
                })
              ]
            }]]
          }
        },
        {
          text:'',
          style: 'nextTitle'
        },
        {
          text: `Détails d'expérience (du plus récent au plus ancien)`,
          style: 'header'
        },
        {
          text: `__________________________________________________________________________________________`,
          style: 'headerTitle',
        },
        {
          text: 'Profession / Titre',
          style: 'headerSubTitle'
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              columns: [
                resume.profession.map(pf => {
                  return [
                    {
                      text: `Titre`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${pf.titre}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Nom, Addresse, Pays de la Société`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${pf.nomSociete}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Résumé`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${pf.resume}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `Durée`,
                      style: 'eduStyle'
                    },
                    {
                      text: `${pf.startDate} à ${pf.endDate}`,
                      style: 'eduStyleContent'
                    },
                    {
                      text: `--------------------------------------------------------------------------------------`,
                      alignment: 'center',
                      style: 'eduLine'
                    },
                  ]
                })
              ]
            }]]
          }
        }

      ],
      styles: {
        name: {
          fontSize: 16,
          bold: true
        },
        header: {
          /*
          fontSize: 18,
          bold: true,*/
          width: '100%',
          fontSize: 18,
          margin: [0, 10, 0, 5],
          //decoration: 'underline',
          color: '#f7c552',
        
        },
        headerTitle: {
          bold: true,
        },
        headerSubTitle: {
          margin: [0, 5, 5, 5],
          color:'#B2B2B2',
          fontSize: 12,
          //borderBottom: '2px solid #333'
        },
        nextTitle: {
          margin: [0, 0, 0, 10]
        },
        titleSubLine: {
          margin : [0, -10, 0, 0],
          color: '#949494'
        },
        tableHeader: {
          bold: true,
        },
        title: {
          fontSize: 16,
          bold: true,
          italic: true
        },
        eduStyle: {
          bold: true,
          decoration: 'underline',
          margin : [5, 5, 5, 5]
        },
        eduStyleContent: {
          margin : [5, 0, 0, 0]
        },
        eduLine: {
          margin : [5, 5, 5, 5],
        }
      },
      info: {
        title: resume.firstName + '_CV',
        author: resume.firstName + resume.lastName,
        subject: 'CV',
        keywords: 'CV, RESUME, Talenta Sourcing',
      },
    };
  }

  viewPDF() {
    const all = {
      firstName: (this.firstName || ''),
      lastName: (this.lastName || ''),
      birthday: (this.birthday || ''),
      email: (this.email || ''),
      numTel: (this.numTel || ''),
      idSkype: (this.idSkype || ''),
      idWhatsapp: (this.idWhatsapp || ''),
      originCountry: (this.originCountry || 'true'),
      actualCountry: (this.actualCountry || ''),
      actualCity: (this.actualCity || ''),
      competence: (this.competences || []),
      secteur: (this.secteur || ''),
      education: (this.educations || []),
      profession: (this.profession || []),
    };

    this.generatePdf('open', all);
  }

  validPDF() {
    //this.viewPDF();
    const all = {
      firstName: (this.firstName || ''),
      lastName: (this.lastName || ''),
      birthday: (this.birthday || ''),
      email: (this.email || ''),
      numTel: (this.numTel || ''),
      idSkype: (this.idSkype || ''),
      idWhatsapp: (this.idWhatsapp || ''),
      originCountry: (this.originCountry || 'true'),
      actualCountry: (this.actualCountry || ''),
      actualCity: (this.actualCity || ''),
      competence: (this.competences || []),
      secteur: (this.secteur || ''),
      education: (this.educations || []),
      profession: (this.profession || []),
    };

    this.generatePdf('send', all);
    this.canSend = true;
  }
  canSend = false;
  
  resetDeposer() {
	this.firstName = '';
    this.lastName = '';
    this.birthday = '';
    this.email = '';
    this.numTel = '';
    this.idSkype = '';
    this.idWhatsapp = '';
    this.originCountry = '';
    this.actualCountry = '';
    this.actualCity = '';
    this.competences = [];
    this.secteur = ' ';
    this.educations = [];
    this.profession = [];
    this.formData = new FormData();
    this.cvU = '';
    this.cv = '';
    
    this.canSend = false;
  };

}
