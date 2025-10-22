import { Component, Input, OnInit } from '@angular/core';
import { OffreService } from '../../services/offre.service';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-ajout-offre',
  templateUrl: './ajout-offre.component.html',
  styleUrls: ['./ajout-offre.component.scss']
})
export class AjoutOffreComponent implements OnInit {
  @Input() title = "Ajout offre d'emploi";
  @Input() mailUser: string;
  defaultLogoPath = 'assets/img/10.jpg';
  blobUrl: any;
  currentUser: any;


  url = environment.baseUrl;


  public Editor = ClassicEditor;
  spinner = false;
  public config = {
    placeholder: 'Type the content here!'
  }

  // Titre
  public EditorTitre = ClassicEditor;
  public configTitre = {
    placeholder: "Entrez l'intitulé du poste à pourvoir",
  }
  // Missions
  public EditorMission = ClassicEditor;
  public configMission = {
    placeholder: "Les missions:",
  }
  // Qualifications
  public EditorQualification = ClassicEditor;
  public configQualification = {
    placeholder: "Les qualifications requises:",
  }
  // Message
  public EditorMessage = ClassicEditor;
  public configMessage = {
    placeholder: "Entrez un message particulier",
  }



  formAdd = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    contexte: new FormControl('', [Validators.required]),
    mission: new FormControl('', [Validators.required]),
    qualification: new FormControl('', [Validators.required]),
    pays: new FormControl('', [Validators.required]),
    secteur: new FormControl('', [Validators.required]),
    grille: new FormControl('', [Validators.required]),
    post: new FormControl('', [Validators.required]),
    message: new FormControl(''),
  });

  formData: FormData = new FormData();
  seeLogo = false;
  seeVideo = false;
  logo = '';
  logoU = '';
  file: any;
  video: any;
  videoU = '';
  fileVideo: string;
  publier = false;
  dossier = false;
  country = [{
    name: 'Quebec'
  }, {
    name: 'Antananarivo'
  }];
  posts = [{
    name: 'CDI'
  }, {
    name: 'CDD'
  }, {
    name: 'STAGE'
  }, {
    name: 'INTERIM'
  }];
  bonnereponses = [{
    title: '+ 25%',
    value: '0.25'
  }, {
    title: '+ 50%',
    value: '0.5'
  }, {
    title: '+ 75%',
    value: '0.75'
  }];
  secteurs = [
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
  isLoading = false;
  isAtalia = false;

  archive = false;
  post: string | Blob;
  offres: any;
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  public sectionSubject: Observable<any> = of([]);
  idUser: any;
  progressImg: number = 0;
  progressVid: number = 0;
  logoPath = '';


  constructor(
    private offreS: OffreService,
    private dataServ: DataService,
    private toastr: ToastrService,
    private router: Router,
    private userServ: UserService,
    private sanitizer: DomSanitizer,
  ) {

    // si il n'y pas de logo
    this.userServ.currentUser().subscribe(currentUser => {
    this.currentUser = currentUser;
    this.mailUser = currentUser.email;

    if(this.mailUser.includes('rakotoni')){
      this.isAtalia = true;
    }

    this.logoPath = this.currentUser.profile_photo_path;
    console.log("Path img 1 : "+this.currentUser.profile_photo_path);
      fetch(this.currentUser?.profile_photo_path ? this.url + this.currentUser?.profile_photo_path : this.defaultLogoPath)
        .then(res => res.blob())
        .then(blob => {
          this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
        })
    })
    this.sectionSubject = this.userServ.getUser();
    this.sectionSubject.subscribe((data: any) => {
      this.currentSection = data;
    });
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    this.offreS.getLastLogo(localStorage.getItem('idUser')).subscribe(response => {
      if (!response.error && response.data) {
        console.log("Path img : "+response.data.path);
        fetch(this.url + response.data.path)
          .then(res => res.blob())
          .then(blob => {
            let objectURL = URL.createObjectURL(blob);
            // console.log(objectURL);
            const reader = new FileReader();
            reader.onprogress = (evt: any) => {
              if (evt.lengthComputable) {
                this.progressImg = Math.round((evt.loaded / evt.total) * 100);
                //console.log(`Uploaded: ${this.progressImg}%`);
              }
            };
            reader.onload = (e: any) => {
              this.progressImg = 100;
              //console.log(`Upload completed`);
              this.logo = e.target.result;
             
              setTimeout(() => { this.progressImg = 0 }, 2000);
            };
            reader.readAsDataURL(blob);
            this.seeLogo = true;

          })

      }
      else if (!response.error && !response.data) {
        fetch("assets/img/10.jpg")
          .then(res => res.blob())
          .then(blob => {
            let objectURL = URL.createObjectURL(blob);
            // console.log(objectURL);
            const reader = new FileReader();
            reader.onprogress = (evt: any) => {
              if (evt.lengthComputable) {
                this.progressImg = Math.round((evt.loaded / evt.total) * 100);
                //console.log(`Uploaded: ${this.progressImg}%`);
              }
            };
            reader.onload = (e: any) => {
              this.progressImg = 100;
              //console.log(`Upload completed`);
              this.logo = e.target.result;
              setTimeout(() => { this.progressImg = 0 }, 2000);
            };
            reader.readAsDataURL(blob);
            this.seeLogo = true;

          })
      }
    })
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;
    }

  }

  testU: string;
  test: any;
  progressFile: any;

  onSelectedFile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.testU = event.target.files[0];
      const reader = new FileReader();
      reader.onprogress = (evt: any) => {
        if (evt.lengthComputable) {
          this.progressFile = Math.round((evt.loaded / evt.total) * 100);
        }
      };
      reader.onload = (e: any) => {
        this.progressFile = 100;
        this.test = e.target.result;
        setTimeout(() => { this.progressFile = 0 }, 2000);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.formData.set('cv', file, file.name);
    }
  }

  // tslint:disable-next-line: typedef
  onSelectedImg(fileInput: any) {
    if (fileInput !== null) {
      this.logoU = fileInput.target.files[0];
      this.file = this.logoU;
      const reader = new FileReader();
      reader.onprogress = (evt: any) => {
        if (evt.lengthComputable) {
          this.progressImg = Math.round((evt.loaded / evt.total) * 100);
          //console.log(`Uploaded: ${this.progressImg}%`);
        }
      };
      reader.onload = (e: any) => {
        this.progressImg = 100;
        //console.log(`Upload completed`);
        this.logo = e.target.result;
        setTimeout(() => { this.progressImg = 0 }, 2000);
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      this.formData.append('logo', this.file, this.file.name);
      this.seeLogo = true;
      
    }
  }
  onSelectedVideo(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.videoU = event.target.files[0];
      const reader = new FileReader();
      if (fileList[0].size / 1024 / 1024 < 25) {

        reader.onprogress = (evt: any) => {
          if (evt.lengthComputable) {
            this.progressVid = Math.round((evt.loaded / evt.total) * 100);
            //console.log(`Uploaded: ${this.progressVid}%`);
          }
        };
        reader.onload = (e: any) => {
          this.progressVid = 100;
          //console.log(`Upload completed`);
          this.video = e.target.result;
          setTimeout(() => { this.progressVid = 0 }, 2000);
          console.log("This.file : "+file+"this.file.name : "+file.name);
        };
        reader.readAsDataURL(event.target.files[0]);
        this.formData.append('video', file, file.name);
        
      } else {
        this.toastr.error('Taille maximale est de 25 Mo', '', {
          timeOut: 5000
        });
      }
    }
    //this.seeVideo = true;
  }
  valider() {
    //this.isLoading = true;
    //this.publier = true;
    this.spinner = true;
    this.formData.set('titre', this.formAdd.controls.title.value || '');
    this.formData.set('description', this.formAdd.controls.description.value || '');
    this.formData.set('contexte', this.formAdd.controls.contexte.value || '');
    this.formData.set('missions', this.formAdd.controls.mission.value || '');
    this.formData.set('qualification', this.formAdd.controls.qualification.value || '');
    this.formData.set('pays', this.formAdd.controls.pays.value || '');
    this.formData.set('publier', this.publier.toString());
    this.formData.set('archived', this.archive.toString());
    this.formData.set('post', this.formAdd.controls.post.value || '');
    this.formData.set('messages', this.formAdd.controls.message.value || '');
    this.formData.set('secteur', this.formAdd.controls.secteur.value || '');
    this.formData.set('passe', this.formAdd.controls.grille.value || '0.5');
    this.formData.set('userId', this.idUser);
    this.formData.set('dossier', this.dossier.toString());
    this.formData.set('logoPath', this.logoPath);

    console.log("AP valid path : "+this.logoPath);
    
    this.offreS.addOffre(this.formData).subscribe((res: any) => {
      console.log("1 er EXCEPTION =>"+res)

      if (res.data.error === true) {
        this.toastr.error('Une erreur est survenue', '', {
          timeOut: 5000
        });
        this.spinner = false;
      } else {
        this.toastr.success('Votre offre est bien créé', '', {
          timeOut: 5000
        });
        this.spinner = false;
        this.goTo('/projet');
      }



    },
      err => {
        this.toastr.error("Problème lors de l'ajout", '', {
          timeOut: 5000
        });
        this.spinner = false;
        console.log("Dernière exception !!! => "+err)
      }
    )
    
  }
  ngOnInit() {
    /*     this.dataServ.getAllPays().subscribe((res: any) => {
          this.country = res;
          //console.log(res)
        }) */
  }
  goTo(path) {
    this.router.navigateByUrl(path);
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
