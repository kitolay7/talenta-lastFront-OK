import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OffreService } from 'src/app/services/offre.service';
import { UserService } from 'src/app/services/user.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-menu-archiver',
  templateUrl: './menu-archiver.component.html',
  styleUrls: ['./menu-archiver.component.scss']
})
export class MenuArchiverComponent implements OnInit {
  title = "La liste de mes dossiers";
  infoQuizs: any[] = [];
  currentUserSubject: BehaviorSubject<any>;
  currentSection: any;
  idUser: any;
  folder = [];
  constructor(
    private quizS: QuizService,
    private offreService: OffreService,
    private userServ: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {

    const userId = parseInt(localStorage.getItem('idUser'));
    this.quizS.findQuizArchived(userId).subscribe((response) => {
      //console.log(response);
      //console.log(response.data[0].offre.id);
      for (let index = 0; index < response.data.length; index++) {
         console.log("Response "+index+" : "+response.data[index].id);
       }
      // this.quizs = [new Quiz(response)];
      this.infoQuizs = response.data;
      console.log(this.infoQuizs);
    });

    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;
      this.offreService.getAllFolderUser(this.idUser).subscribe(data => {
        this.folder = data;
        //console.log("Data : "+data);
      });
    }
  }

  ngOnInit(): void {
  }

  makeTestEnable(idQuiz) {
    this.quizS.updateQuizArchive(idQuiz, { archive: false, publier: false }).subscribe((response) => {
      this.toastr.success(`Questionnaire activé avec succès`, '', {
        timeOut: 5000
      });
      this.router.navigateByUrl("/projet");
    },
      (error) => {
        this.toastr.error("Problème lors de la mise à jour", '', {
          timeOut: 5000
        });
      })
  }

}
