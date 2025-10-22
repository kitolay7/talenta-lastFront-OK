import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private userS: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.idU = params.idCandidat;
      this.userS.getProfilData(this.idU).subscribe((data: any) => {
        this.profileData = data;
        console.log(this.profileData)
        this.loading = true;
      })
    });
  }


}
