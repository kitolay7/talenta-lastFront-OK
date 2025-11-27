import { Component, OnInit, TemplateRef, HostListener, ElementRef, ViewChild, Renderer2, Input } from '@angular/core';
import { DownloadCsvService } from '../../services/download-csv.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { OffreService } from '../../services/offre.service';
import { Offres } from '../../models/offres';
import { environment } from '../../../../src/environments/environment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DataService } from '../../../../src/app/services/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
registerLocaleData(localeFr, 'fr');
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface Section {
  titre: string;
  missions: string;
  contexte: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  defaultLogo: any;
  currentUserSubject: BehaviorSubject<any>;
  postul = true;

  // constructor


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private downService: DownloadCsvService,
    private offreService: OffreService,
    private router: Router,
    private userS: UserService,
    private el: ElementRef,
    public breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private userServ: UserService,
    private toastr: ToastrService,
    private dataServ: DataService,
    private sanitizer: DomSanitizer,
  ) {
    this.createformRegister();
    this.sectionSubject = this.userS.getSection();
    this.sectionSubject.subscribe((data: any) => {
      this.currentSection = data;
    });
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('Token'));
    if (this.currentUserSubject.getValue() !== null) {
      // tslint:disable-next-line: max-line-length
      this.userServ.getProfilData(localStorage.getItem('idUser')).subscribe((data: any) => {
        if (data.roles?.includes('ROLE_RECRUTEUR')) {
          this.postul = false;
        }
      })
    }

    // chips

    this.filteredCompetences = this.competenceCtrl.valueChanges.pipe(
      startWith(null),
      map((competence: string | null) => competence ? this._filter(competence) : this.allCompetences.slice()));


  }


  isLoading = true;
  loaded: any;

  // ngOnInit


  ngOnInit(): void {

    fetch("assets/img/10.jpg")
      .then(res => res.blob())
      .then(blob => {
        // console.log(URL.createObjectURL(blob).split(":").splice(0, 1).join(":"));
        this.defaultLogo = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      })

    this.isLoading = true;

    this.dataServ.getAllPays().subscribe((res: any) => {
      this.countries = res;
      this.isLoading = false;
    });

    var sect = this.currentSection;
    setTimeout(() => {
      this.scrollTo(sect);
    }, 1000)

  }

  config: any;

  jsonData = [
    {
      name: 'Anil Singh',
      age: 33,
      average: 98,
      approved: true,
      description: 'I am active blogger and Author.'
    },
    {
      name: 'Reena Singh',
      age: 28,
      average: 99,
      approved: true,
      description: 'I am active HR.'
    },
    {
      name: 'Aradhya',
      age: 4,
      average: 99,
      approved: true,
      description: 'I am engle.'
    },
  ];

  partenaires = [
    {
      name: "Telma",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '51.png',
      link: 'https://www.telma.mg/'
    },
    {
      name: "Group Basan",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '52.png',
      link: 'http://www.basan.mg/'
    },
    {
      name: "Madajob",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '53.png',
      link: 'https://www.madajob.mg/'
    },
    {
      name: "Portaljob Madagascar",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '54.png',
      link: 'https://www.portaljob-madagascar.com/'
    },
    {
      name: "Ambatovy",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '55.png',
      link: 'http://www.ambatovy.com/'
    },
    {
      name: "LinkedIn",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '56.png',
      link: 'https://fr.linkedin.com/'
    },
    {
      name: "Indeed",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '57.png',
      link: 'https://www.indeed.com/'
    },
  ];

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


  accountClass = '';
  newClass = 'activModal';
  newsCustomer = false;
  MselectSexe = 'selectedSexe';
  FselectSexe = 'unselectedSexe';
  signe = 'password';
  faLogin = 'visibility_off';
  mdp;
  votreEmail;
  formRegister: FormGroup;
  sexe = 'HOMME';
  public modalOffre1: BsModalRef;
  public bsModalRef1: BsModalRef;
  public modalRef2: BsModalRef;
  public modalDeposer1: BsModalRef;
  public modalOffre: BsModalRef;
  public modalPostuler: BsModalRef;
  public conformite: BsModalRef;
  public modalDeposer: BsModalRef;
  public modalRef: BsModalRef;
  public slideModal: BsModalRef;
  p: any;
  recherche: any;
  term: any;
  term2: any;
  resultNumber: number;

  posts: Offres[] = [];

  url = environment.baseUrl;

  lieu = 'Antananarivo';

  countries = [];
  villes = ['Antananarivo', 'Paris', 'Quebec'];
  paysControl = new FormControl('', Validators.required);

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



  // tslint:disable-next-line: typedef
  // tslint:disable-next-line: typedef
  loginModal(template: TemplateRef<any>, a) {
    if (a.includes('compte')) {
      this.newsCustomer = false;
    } else {
      this.newsCustomer = true;
    }
    this.modalRef2 = this.modalService.show(
      template,
      Object.assign({}, { class: 'loginClass' })
    );
  }
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
        this.checkPw
      ])],
      confpassword: ['', Validators.compose([
        Validators.required,
        this.checkPw,
      ])],
    });
  }
  // tslint:disable-next-line: typedef
  checkMail(controls) {
    //const regExp = new RegExp(/\S+@\S+\.\S+/);
    const regExp = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkMail: true };
    }
  }
  // tslint:disable-next-line: typedef
  checkPw(controls) {
    const regExp = new RegExp(/^([a-zA-Z0-9@*#]{8,64})$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { checkPw: true };
    }
  }

  // tslint:disable-next-line: typedef
  checkCpw(controls) {
    if (this.password.value === this.confpassword.value) {
      return null;
    } else {
      return { checkCpw: true };
    }
  }


  // Check password

  // getting the form control elements
  get password(): AbstractControl {
    return this.formRegister.controls['password'];
  }

  get confpassword(): AbstractControl {
    return this.formRegister.controls['confpassword'];
  }

  onChangepw() { }


  login() {
    const user = {
      mail: this.votreEmail,
      mdp: this.mdp
    };
    this.userS.login(user).subscribe((data: any) => {
      console.log(data)
    })
  }
  // tslint:disable-next-line: typedef
  createAccount() { }
  // tslint:disable-next-line: typedef
  selectSexe() {
    if (this.MselectSexe === 'selectedSexe' && this.FselectSexe === 'unselectedSexe') {
      this.FselectSexe = 'selectedSexe';
      this.MselectSexe = 'unselectedSexe';
      this.sexe = 'FEMME';
    } else if (this.FselectSexe === 'selectedSexe' && this.MselectSexe === 'unselectedSexe') {
      this.FselectSexe = 'unselectedSexe';
      this.MselectSexe = 'selectedSexe';
      this.sexe = 'HOMME';
    }
  }
  showPassLogin() {
    if (this.signe === 'password' && this.faLogin === 'visibility_off') {
      this.signe = 'text';
      this.faLogin = 'visibility';
    } else {
      this.signe = 'password';
      this.faLogin = 'visibility_off';
    }
  }



  seeModal(template: TemplateRef<any>, lieu: string) {
    this.modalOffre = this.modalService.show(template,
      Object.assign({}, { class: 'offreClass', size: 'lg' })
    );
    this.lieu = lieu;
    this.offreService.geteOfferByPays(lieu).subscribe(data => {
      this.posts = data;
      console.log(this.posts)
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
  }
  goTo(path, b) {
    if (path.includes('candidat/registration')) {
      this.modalOffre.hide();
      console.log(b.id)
      this.offreService.setOffre(b.id);
      this.router.navigateByUrl(path);
    } else {
      this.router.navigateByUrl(path);
      this.modalOffre.hide();
    }
  }
  detailOffre(template: TemplateRef<any>) {
    this.modalOffre.hide();
    this.modalRef2 = this.modalService.show(
      template,
      Object.assign({}, { class: 'loginRecClass', ignoreBackdropClick: true })
    );
  }

  // modalPostuler

  openPostuler(template: TemplateRef<any>) {
    this.modalPostuler = this.modalService.show(template,
      Object.assign({}, { class: 'postulerClass', size: 'lg', ignoreBackdropClick: true })
    );
  }


  // ******************* Modal LOGIN *******************


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

  checkCpwNew = (this.pwOK) ? false : true;

  hide = true;
  confirmMdp: any;
  hideControl = new FormControl(false);
  roleCreate: string;
  idOffer: number;

  openModal(template: TemplateRef<any>, role: string, idOffer: number) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'loginRecClass', ignoreBackdropClick: true })
    );
    this.idOffer = idOffer;
    this.roleCreate = role;
    console.log(this.roleCreate);
    this.modalOffre.hide();
    this.formLoginRecruteur.reset();
    this.formRegisterRecruteur.reset();
    this.formForgetRecruteur.reset();
  }


  selectTab(tabId: number, staticTabs: TabsetComponent) {
    staticTabs.tabs[tabId].active = true;
  }


  createAccountNew(staticTabs: TabsetComponent) {
    const recruteur = {
      username: this.formRegisterRecruteur.controls.pseudoFC.value,
      email: this.formRegisterRecruteur.controls.emailFC.value,
      tel: this.formRegisterRecruteur.controls.telFC.value,
      societe: this.formRegisterRecruteur.controls.enterpriseFC.value,
      codePostal: this.formRegisterRecruteur.controls.codeFC.value,
      pays: this.formRegisterRecruteur.controls.paysFC.value,
      password: this.formRegisterRecruteur.controls.mdpFC.value,
      role: this.roleCreate
    };
    this.userS.register(recruteur).subscribe((data: any) => {
      console.log(data)
      if (data.error === false) {
        this.toastr.success('Votre compte à été créer. Veuillez vérifier votre mail pour finaliser votre inscription.', '', {
          timeOut: 5000
        });
        this.modalRef.hide();
        this.formRegisterRecruteur.reset();
        this.selectTab(0, staticTabs);
      } else {
        this.toastr.error(data.error.message, '', {
          timeOut: 4000
        });
        console.log(data)
      }

    },
      err => {
        console.log(err)
        this.toastr.error('Erreur de connexion', '', {
          timeOut: 4000
        });
      });
  }

  loginAccount() {
    const user = {
      email: this.formLoginRecruteur.controls.mailControl.value,
      password: this.formLoginRecruteur.controls.pwControl.value,
    };
    this.userS.login(user).subscribe((data: any) => {
      console.log(data);
      if (data.error === false) {
        this.toastr.success('Bienvenue  ' + data.username, '', {
          timeOut: 1000
        });
        this.userS.storeUserData(data.id, data.accessToken)
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
            path: '/myaccount'
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
        this.userS.setMenu(menu);
        this.formLoginRecruteur.reset();
        this.modalRef.hide();
        this.router.navigateByUrl('/postuler/' + this.idOffer);
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
        console.log(err)
      });
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
        this.toastr.error(err.message, '', {
          timeOut: 5000
        });
        console.log(err)
      });
  }

  // ******************* Modal LOGIN FIN *******************



  // View slide


  viewSlide(template: TemplateRef<any>) {
    this.openSlideModal(template);
  }

  // Slide Modal

  openSlideModal(template: TemplateRef<any>) {
    this.slideModal = this.modalService.show(template,
      Object.assign({}, { class: 'slideClass', size: 'lg' })
    );
  }

  // formulaire

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();


  // scroll spy

  scrollTo(section: string) {
    document.getElementById(section)
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const scroll = window.scrollY;
    let mainH = document.getElementById('main-banner').clientHeight * 0.3;
    let offreH = document.getElementById('offre').clientHeight + mainH;
    let testimonialH = document.getElementById('testimonial').clientHeight + offreH;
    let serviceH = document.getElementById('service').clientHeight + testimonialH;
    let partenairesH = document.getElementById('partenaires').clientHeight + serviceH;

    this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      //console.log(state)
      //console.log(this.el.nativeElement.children)
      if (state.matches) {
        if (scroll < mainH) {
          this.userS.setSection('main-banner');
        } else if (scroll < offreH) {
          this.userS.setSection('offre');
        } else if (scroll < testimonialH) {
          this.userS.setSection('testimonial');
        } else if (scroll < serviceH) {
          this.userS.setSection('service');
        } /* else if (scroll > partenairesH) {
          this.userS.setSection('partenaires');
        } */
      }

    });


  }


  // modalDeposer

  openDeposer(template: TemplateRef<any>) {
    this.resetDeposer();
    this.modalDeposer = this.modalService.show(template,
      Object.assign({}, { class: 'deposerClass', size: 'lg', ignoreBackdropClick: true })
    );
  }


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
    this.educations.splice(i - 1, 1);
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
        this.toastr.success('Votre dossier a été déposé', '', {
          timeOut: 5000
        });
        this.resetDeposer();
        this.canSend = false;
        this.modalDeposer.hide();
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
  formData: FormData = new FormData();
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

  getRGPD() {
    const dwldLink = document.createElement('a');
    dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', 'http://ec.ccm2.net/droit-finances.commentcamarche.net/download/files/GLnmzFxp4tM_rgpd-PDF.pdf');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
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
          console.log(this.formData.get('infos'));
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
          text: 'Informations personnels',
          style: 'header'
        },
        {
          text: resume.firstName + ' ' + resume.lastName,
          style: 'name'
        },
        {
          text: `Date de naissance : ${resume.birthday.toLocaleDateString('fr-FR')}`,
        },
        {
          text: 'Email : ' + resume.email,
          color: 'blue',
        },
        {
          text: 'Numero de téléphone : ' + resume.numTel,
        },
        {
          text: 'Id Skype : ' + resume.idSkype,
        },
        {
          text: 'Id Whatsapp : ' + resume.idWhatsapp,
        },
        {
          text: `Voyage hors du pays d'origine : ${(resume.originCountry === 'true' ? 'Oui' : 'Non')}`,
        },
        {
          text: 'Pays actuel : ' + resume.actualCountry,
        },
        {
          text: 'Ville actuel : ' + resume.actualCity,
        },
        {
          text: 'Secteur : ' + resume.secteur,
        },
        {
          text: 'Compétences',
          style: 'header'
        },
        {
          columns: [
            {
              ul: resume.competence.map(s => s)
            },
          ]
        },
        {
          text: 'Détails éducatifs',
          style: 'header'
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              columns: [
                resume.education.map(ed => {
                  return [
                    {
                      text: `Nom, Addresse, Pays de l'Institut/ Ecole : ${ed.titre}`,
                    },
                    {
                      text: `Spécialisation : ${ed.specialisation}`,
                    },
                    {
                      text: `Diplôme : ${ed.diplome}`,
                    },
                    {
                      text: `Durée : ${ed.startDate} à ${ed.endDate}`,
                    },
                    {
                      text: `_________________________________________________`,
                      alignment: 'center',
                    },
                  ]
                })
              ]
            }]]
          }
        },
        {
          text: `Détails d'exprérience (du plus récent au plus ancien)`,
          style: 'header'
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              columns: [
                resume.profession.map(pf => {
                  return [
                    {
                      text: `Titre : ${pf.titre}`,
                    },
                    {
                      text: `Nom, Addresse, Pays de la Société : ${pf.nomSociete}`,
                    },
                    {
                      text: `Résumé : ${pf.resume}`,
                    },
                    {
                      text: `Durée : ${pf.startDate} à ${pf.endDate}`,
                    },
                    {
                      text: `_________________________________________________`,
                      alignment: 'center',
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
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
          color: 'orange',
        },
        tableHeader: {
          bold: true,
        },
        title: {
          fontSize: 16,
          bold: true,
          italic: true
        },
      },
      info: {
        title: resume.firstName + '_CV',
        author: resume.firstName + resume.lastName,
        subject: 'CV',
        keywords: 'CV, RESUME, Talenta Sourcing',
      },
    };
  }

  openConformite(template: TemplateRef<any>) {
    this.conformite = this.modalService.show(template,
      Object.assign({}, { class: 'deposerClass', size: 'lg', ignoreBackdropClick: true })
    );
  }

  closeConformite(){
    this.conformite.hide();
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

  goToPartenaire(link: string) {
    const dwldLink = document.createElement('a');
    dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', link);
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

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


