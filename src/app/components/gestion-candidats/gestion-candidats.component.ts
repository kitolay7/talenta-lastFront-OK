import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { from } from 'rxjs';
import { OffreService } from '../../services/offre.service';
import { PostulationService } from '../../services/postulation.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-gestion-candidats',
	templateUrl: './gestion-candidats.component.html',
	styleUrls: ['./gestion-candidats.component.scss'],
})
export class GestionCandidatsComponent implements OnInit {

	constructor(
		private socket: Socket,
		private offreS: OffreService,
		private postulationS: PostulationService,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {

		this.offreS.geteOfferUser(localStorage.getItem('idUser')).subscribe((res: any) => {
			//console.log(res)
			this.offres = res;
			this.offres.forEach(offre => {
				this.offreS.getUsersByOffer(offre.id).subscribe(response => {
					this.postulations = response.data;
					//console.log(this.postulations);
					if (this.postulations.length > 0) {
						this.allCandidats.push(this.postulations[0]);
					}
				})
			})
			this.loading = true;
		})
	}
	title = "LA GESTION DES CANDIDATURES";
	postulations = [];
	allC = [];
	allCandidats = [];
	offres: any;
	loading = false;

	getDecision(totalPoint: number, note: number) {
		if (totalPoint === 0) {
			return "En attente";
		}
		if (note < (totalPoint / 2)) {
			return "Refusé";
		}
		else {
			return "Entretien";
		}
	}

}
