import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { MailerService } from 'src/app/services/mailer.service';
import { OffreService } from 'src/app/services/offre.service';
import { PostulationService } from 'src/app/services/postulation.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-main-notation',
  templateUrl: './main-notation.component.html',
  styleUrls: ['./main-notation.component.scss']
})
export class MainNotationComponent implements OnInit {
  urlblob = environment.baseUrl;
  responseQuiz: any[] = [];
  offreId: number;
  userId: number;
  name: string;

  constructor(
    private socket: Socket,
    private offreS: OffreService,
    private userS: UserService,
    private postulationS: PostulationService,
	private router: Router,
    private route: ActivatedRoute,
    private mailerService: MailerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const paramsUserId = this.route.snapshot.params.userId;
    this.userId = parseInt(paramsUserId);
    this.userS.getProfilData(this.userId).subscribe((data: any) => {
      this.name = `${data.profile.firstName ? data.profile.firstName : 'CANDIDAT'} ${data.profile.lastName ? data.profile.lastName : ''}`;
    });

    const paramsOffreId = this.route.snapshot.params.offreId;
    this.offreId = parseInt(paramsOffreId);
    this.postulationS.getPostulationResponses(paramsUserId, paramsOffreId).subscribe(response => {
      this.responseQuiz = response.data;
      // initialize critere Point Win
      // for (let index = 0; index < this.responseQuiz.length; index++) {
      //   this.responseQuiz[index] = { ...this.responseQuiz[index], ...{ pointWin: 0 } }
      // }
      console.log(this.responseQuiz);
    })
  }
  
  goTo(path) {
    this.router.navigateByUrl(path);
  }
	
  inputNote = new FormGroup({
	  note_p: new FormControl('', [Validators.required])
  });
  editResponseTest(newValue, id) {
    this.postulationS.updatePostulationResponses(this.userId, this.offreId, { pointWin: parseInt(newValue), id: id })
      .subscribe(response => {
        if (!response.error) {
          this.toastr.success('Réponse notée manuellement', '', {
            timeOut: 5000
          })
        }
      })
  }

  editResponseMultiple() {
    this.postulationS.updatePostulationResponsesMultiple(this.userId, this.offreId, { responseToUpdate: this.responseQuiz }).subscribe(response => {
      if (!response.error) {
        this.toastr.success('Réponse notée manuellement effectuée', '', {
          timeOut: 5000
        })
		this.goTo('/offre/'+this.offreId+'/users');
      }
    })
  }

}
