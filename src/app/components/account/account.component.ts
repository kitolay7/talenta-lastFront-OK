import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
	title = "BIENVENUE SUR VOTRE INTERFACE";
	constructor(
		private router: Router,
		private userServ: UserService,
	) { }

	ngOnInit(): void {
		this.userServ.getProfilData(localStorage.getItem('idUser')).subscribe((data: any) => {
			//console.log(data);
			if (data.error === false) {
				if (data.email.includes('talenta@recrutement.mg')) {
					this.isAdmin = true;
					this.loading = true;
				} else {
					this.loading = true;
				}
			}
		})
	}

	fieldList = [
		/*
			{
				title: 'Ajouter offre d’emploi',
				image: '24.jpg',
				desc: 'Vous accédez à tous vos recrutements en cours et au Dashboard respectif. Les Dashboard vous donnent une visibilité globale des profils des candidats et les qualifient. Toutes les restitutions se font par de simples clics.',
				link: '/ajout-offre',
			}, 
		*/
		{
			title: 'Créer un nouveau test',
			image: '1-creer-test.jpg',
			desc: 'Pertinent et fiable, le test que vous concevez est entièrement à votre image. C’est simple, vous déterminez vos critères de présélection et l’outil fait le reste. Vous pouvez, à partir de là, vous concentrer sur la préparation des rencontres et optimiser au maximum l’entretien en face à face.',
			link: '/create-test',
		},
		{
			title: 'Recrutement en cours',
			image: '2-test-en-cours.jpg',
			desc: 'Ici, vous accédez aux résultats des présélections. En simples clics, vous pouvez informer les candidats participants aux tests de leurs résultats et de la suite de leur candidature.',
			link: '/test',
		},
		{
			title: 'Projet',
			image: '3-projet.jpg',
			desc: 'Anticiper des recrutements ou un report de recrutement ? C’est dans Projet que vous allez gérer cela. Vous pouvez peaufiner, finaliser à tout moment tous vos projets.',
			link: '/projet',
		},
		{
			title: 'Archives',
			image: '4-archive.jpg',
			desc: 'Vos créativités, vos réussites sont stockées ici. Vous pouvez les consulter à tout moment et faire des annotations en tout temps.',
			link: '/listingArchiver',
		},
		{
			title: 'Les candidats',
			image: '5-candidats.jpg',
			desc: 'Ici, vous avez une vue globale de tous les candidats : leurs résultats aux tests et leurs informations personnelles.',
			link: '/gestion_candidats',
		},
	];

	fieldListAdmin = [
		{
			title: 'Candidature spontanée',
			image: '5-candidats.jpg',
			desc: 'Ici, vous avez une vue globale de tous les candidats qui ont postulé directement',
			link: '/listingSpontaneous',
		},
		{
			title: 'Banque de CV',
			image: '4-archive.jpg',
			desc: 'La collection de CV importé lors des candidatures spontanées',
			link: '/banqueCV',
		},
	];

	isAdmin = false;
	loading = false;

	goTo(path) {
		this.router.navigateByUrl(path);
	}

}
