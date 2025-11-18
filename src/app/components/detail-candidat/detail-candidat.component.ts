import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../src/app/services/user.service';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'app-detail-candidat',
  templateUrl: './detail-candidat.component.html',
  styleUrls: ['./detail-candidat.component.scss']
})
export class DetailCandidatComponent implements OnInit {

  title = "Details du candidat";
  profileData: any;
  idU: any;
  loading = false;
  cvUrl: string | null = null;
  cvName: string | null = null;

  constructor(
    private userS: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.idU = params.idCandidat;
      this.userS.getProfilData(this.idU).subscribe((data: any) => {
        this.profileData = data;
        const profile = data.profile || {};
        if (profile.cvPath) {
          this.cvUrl = environment.baseUrl + 'cv/' + profile.cvPath;
          this.cvName = profile.cvOriginalName || 'CV du candidat';
        }
        this.loading = true;
      })
    });
  }


}
