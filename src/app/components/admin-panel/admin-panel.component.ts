import { Component } from '@angular/core';
import { FeatureService, FeatureMode } from '../../services/feature.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  selectedMode: FeatureMode = 'all';

  constructor(private featureService: FeatureService) {}

  updateFeatures() {
    this.featureService.setFeatures(this.selectedMode);
  }
}