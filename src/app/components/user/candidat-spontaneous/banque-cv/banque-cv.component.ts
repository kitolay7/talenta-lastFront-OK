import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banque-cv',
  templateUrl: './banque-cv.component.html',
  styleUrls: ['./banque-cv.component.scss']
})
export class BanqueCvComponent implements OnInit {

  constructor(
    private userServ: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
		
		/*
		this.userServ.getAllSpontaneous().subscribe((res: any) => {
			//console.log(res)
			this.allCandidats = res;
			this.loading = true;
		})
		*/
		this.userServ.getSpontaneousNonTraiter().subscribe((res: any) => {
			//console.log(res)
			this.allCandidats = res;
			let sect = [];
			res.forEach(sec => {
				sect = [...sect, sec.secteur];
			})
			let count = sect.reduce((prev, cur) => {
  				prev[cur] = (prev[cur] || 0) + 1;
  				return prev;
			}, {});
			let tempsect = Object.entries(count);
			//console.log(tempsect)
			
			this.secteurs.forEach(sect => {
				
				var val: any;
				tempsect.forEach(sec => {
					if (sec[0] === sect) {
						val = sec[1]
					}
				});
				
				this.allsecteurs.push([sect, (val || 0)]);
			});
			
			//console.log(this.allsecteurs);
			this.loading = true;
		})
  }
  
  loading = false;
  allCandidats: any;
  allsecteurs = [];
  showTable = false;
  activeSecteur = '';
  nbCandidat: number;
  url = environment.baseUrl;
  
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
  
  detail(id: number) {
  	if (this.allsecteurs[id][1] !== 0 ) {
  		this.showTable = true;
  		this.activeSecteur = this.allsecteurs[id][0];
  		console.log(this.activeSecteur);
  		this.nbCandidat = this.allsecteurs[id][1];
  	} else {
  		this.showTable = false;
  		this.activeSecteur = this.allsecteurs[id][0];
  		this.nbCandidat = this.allsecteurs[id][1];
  	}
  }
  getCV(lien: string) {
  	const dwldLink = document.createElement('a');
  	dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', this.url + 'cv/' + encodeURIComponent(lien));
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  
}
