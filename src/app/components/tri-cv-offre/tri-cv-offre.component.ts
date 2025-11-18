import { Component, Input } from '@angular/core';
import { CvService } from '../../../../src/app/services/cv.service';

@Component({
  selector: 'app-tri-cv-offre',
  templateUrl: './tri-cv-offre.component.html',
  //styleUrls: ['./tri-cv-offre.component.scss']
})
export class TriCvOffreComponent {

  @Input() candidats: any[] = [];   // candidats de l'offre
  @Input() offreId!: number;        // id de l'offre concernée

  // critères
  diplomeCritere: string = '';
  experienceMinCritere: number = 0;
  fonctionsCritere: string = '';
  customPrompt: string = '';

  // résultat GPT
  gptResult: any = null;
  filtering = false;

  constructor(private cvService: CvService) {}

  filtrerCvsAvecGpt() {
    if (!this.candidats || this.candidats.length === 0) {
      return;
    }

    this.filtering = true;

    const fonctions = this.fonctionsCritere
      ? this.fonctionsCritere.split(',')
          .map(f => f.trim())
          .filter(f => !!f)
      : [];

    const criteria = {
      diplome: this.diplomeCritere,
      experienceMin: this.experienceMinCritere,
      fonctions,
      customPrompt: this.customPrompt,
      offreId: this.offreId     // utile si tu veux tracer côté back
    };

    // On prépare le payload CVs envoyé à l'API /api/cv/filter
    const cvs = this.candidats.map(c => ({
      id: c.user?.id || c.id,
      nom: c.user?.profile?.firstName + ' ' + c.user?.profile?.lastName,
      diplome: c.user?.profile?.diplomes,
      experience: c.user?.profile?.anneesExperiences,
      fonction: c.user?.profile?.metierActuel,
      cvUrl: c.user?.profile?.cvPath ? '/cv/' + c.user.profile.cvPath : null
    }));

    this.cvService.filterCvs(criteria, cvs).subscribe({
      next: (res) => {
        this.gptResult = res.filteredCvs;
        this.filtering = false;
      },
      error: (err) => {
        console.error(err);
        this.filtering = false;
      }
    });
  }
}
