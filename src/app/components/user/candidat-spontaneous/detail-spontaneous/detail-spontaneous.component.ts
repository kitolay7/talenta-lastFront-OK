import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail-spontaneous',
  templateUrl: './detail-spontaneous.component.html',
  styleUrls: ['./detail-spontaneous.component.scss']
})
export class DetailSpontaneousComponent implements OnInit {


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
    	this.userS.getSpontaneousById(this.idU).subscribe((data: any) => {
      	this.profileData = data;
      	console.log(this.profileData)
      	this.loading = true;
    	})
    });
  }

}
