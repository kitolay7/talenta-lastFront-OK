import { Component, OnInit } from '@angular/core';
import { AdminFeatureService, QuizMode } from '../../../../src/app/services/admin-feature.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  selectedMode: QuizMode = 'all';
  saving = false;
  savedAt?: Date;
  errorMsg = '';

  constructor(private feature: AdminFeatureService) {}

  ngOnInit(): void {
    // Assure le chargement depuis le serveur
    this.feature.ensureLoaded();
    // Abonnement au flux
    this.feature.mode$.subscribe(m => {
      this.selectedMode = m;
    });
  }

  updateFeatures(): void {
    this.saving = true;
    this.errorMsg = '';
    this.feature.setMode(this.selectedMode).subscribe({
      next: () => {
        this.saving = false;
        this.savedAt = new Date();
      },
      error: () => {
        this.saving = false;
        this.errorMsg = 'Erreur lors de la sauvegarde. Réessayez.';
      }
    });
  }
}
