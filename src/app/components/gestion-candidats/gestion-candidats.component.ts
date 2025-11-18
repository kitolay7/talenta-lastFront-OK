import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OffreService } from '../../services/offre.service';
import { PostulationService } from '../../services/postulation.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { CvService } from '../../../../src/app/services/cv.service';
import { Pipe, PipeTransform } from '@angular/core';


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
    private route: ActivatedRoute,
    private cvService: CvService
  ) { }

  title = "LA GESTION DES CANDIDATURES";

  // données
  offres: any[] = [];
  allCandidats: any[] = [];
  loading = false;

  // sélection d'offre pour le tri
  selectedOffreId: number | null = null;
  selectedOffreCandidats: any[] = [];
  selectedOffreLibelle: string | null = null;

  // === critères de tri GPT ===
  diplomeCritere: string = '';
  experienceMinCritere: number = 0;
  fonctionsCritere: string = '';
  customPrompt: string = '';
  gptResult: any = null;
  filtering = false;
  // ===========================

  ngOnInit(): void {
    this.loading = false;

    const idUser = localStorage.getItem('idUser');

    this.offreS.geteOfferUser(idUser).subscribe((res: any) => {
      this.offres = res || [];

      if (!this.offres.length) {
        this.loading = true;
        return;
      }

      // pour chaque offre, récupérer les candidats
      this.offres.forEach(offre => {
        this.offreS.getUsersByOffer(offre.id).subscribe(response => {
          const postulationsOffre = response && response.data ? response.data : [];

          if (postulationsOffre.length > 0) {
            // concaténer toutes les candidatures dans un seul tableau
            this.allCandidats = this.allCandidats.concat(postulationsOffre);
          }
        });
      });

      

      this.loading = true;
    });

    if (this.gptResult) {
        this.gptResult.retenus.sort((a, b) => b.score - a.score);
        this.gptResult.rejetes.sort((a, b) => b.score - a.score);
      }
  }

  getDecision(totalPoint: number, note: number) {
    if (totalPoint === 0) {
      return "En attente";
    }
    if (note < (totalPoint / 2)) {
      return "Refusé";
    } else {
      return "Entretien";
    }
  }

  // changement d'offre dans le select
  onOffreChange() {
    console.log('selectedOffreId = ', this.selectedOffreId);
    console.log('allCandidats offre ids = ', this.allCandidats.map(c => c.offre && c.offreId));
    if (!this.selectedOffreId) {
      this.selectedOffreCandidats = [];
      this.selectedOffreLibelle = null;
      this.gptResult = null;
      return;
    }
    console.log('All candidats', this.allCandidats);
    this.selectedOffreCandidats = this.allCandidats.filter(
      
      c => c.offre && c.offreId === this.selectedOffreId
      
    );

    const offre = this.offres.find(o => o.id === this.selectedOffreId);
    this.selectedOffreLibelle = offre ? `${offre.titre} (${offre.post})` : null;

    // on réinitialise le résultat GPT quand on change d'offre
    this.gptResult = null;
  }

  // appel GPT pour filtrer les CV de l'offre sélectionnée
  filtrerCvsAvecGpt() {
    if (!this.selectedOffreId) {
      return;
    }
    if (!this.selectedOffreCandidats || this.selectedOffreCandidats.length === 0) {
      return;
    }

    this.filtering = true;

    const fonctions = this.fonctionsCritere
      ? this.fonctionsCritere.split(',').map(f => f.trim()).filter(f => !!f)
      : [];

    const criteria = {
      diplome: this.diplomeCritere,
      experienceMin: this.experienceMinCritere,
      fonctions,
      customPrompt: this.customPrompt,
      offreId: this.selectedOffreId
    };
    /*
    const cvs = this.selectedOffreCandidats.map(c => ({
      id: c.user?.id || c.userId,
      nom: c.user?.profile?.firstName + ' ' + c.user?.profile?.lastName,
      diplome: c.user?.profile?.diplomes,
      experience: c.user?.profile?.anneesExperiences,
      fonction: c.user?.profile?.metierActuel,
      cvUrl: c.user?.profile?.cvPath ? '/cv/' + c.user.profile.cvPath : null
    }));*/
    const cvs = this.selectedOffreCandidats.map(c => ({
      //console.log('candidate raw object:', c),
      id: c.user?.id || c.userId,
      nom: c.user?.profile?.firstName + ' ' + c.user?.profile?.lastName,
      cvUrl: c.user?.profile?.cvPath ? '/cv/' + c.user.profile.cvPath : null, //+ c.user.profile.cvPath : null
      content: c 
    }));

    this.cvService.filterCvs(criteria, cvs).subscribe({
      next: (res) => {
        this.gptResult = res.filteredCvs;
        this.filtering = false;
      },
      error: (err) => {
        console.error(err);
        this.filtering = false;
        // tu peux remplacer par Toastr si tu en utilises un
        alert(err.error?.message || 'Erreur lors du tri automatique des CV.');
      }
    });
  }

}
