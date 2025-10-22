import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/services/offre.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { QuizService } from 'src/app/services/quiz.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Quiz } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listing-projet',
  templateUrl: './listing-projet.component.html',
  styleUrls: ['./listing-projet.component.scss']
})
export class ListingProjetComponent implements OnInit {
  title = "La liste de mes projets";
  infoQuizs: any[] = [];
  offers: any[] = [];
  constructor(
    private quizS: QuizService,
    private offreS: OffreService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    const userId = parseInt(localStorage.getItem('idUser'));
    this.quizS.findAllQuiz(userId).subscribe((response) => {
      console.log(response);
      // for (let index = 0; index < response.data.length; index++) {
      //   this.quizs.push(response.data[index].quizz);
      // }
      // this.quizs = [new Quiz(response)];
      this.infoQuizs = response.data;
      console.log(this.infoQuizs);
    });
    this.offreS.geteOfferByUser(userId).subscribe((response => {
      this.offers = response;
    }))
  }
  ngOnInit() {
  }

  archiveOffre(offerId, quizzId) {
    this.offreS.updateOffreQuizzArchive(offerId, quizzId, { archive: true, publier: false }).subscribe(
      (response) => {
        this.toastr.success(`Offre archivée`, '', {
          timeOut: 5000
        });
        this.router.navigateByUrl("/listingArchiver")
      },
      (error) => {
        this.toastr.error("Problème lors de l'archivage !", '', {
          timeOut: 5000
        });
      }
    )
    
   console.log("Offre ID : "+offerId+" - Quizz ID : "+quizzId);
  }

  archiveQuiz(quizId) {
    this.quizS.updateQuizArchive(quizId, { archive: true, publier: false }).subscribe(
      (response) => {
        this.toastr.success(`Questionnaire archivé`, '', {
          timeOut: 5000
        });
        this.router.navigateByUrl("/listingArchiver")
      },
      (error) => {
        this.toastr.error("Problème lors de la mise à jour", '', {
          timeOut: 5000
        });
      }
    )
  }

  publierQuiz(infoQuiz: any, lastValue: boolean) {
    if (infoQuiz.offre.publier) {
      this.quizS.updateQuizStatePublished(infoQuiz.quizz.id, { publier: lastValue }).subscribe((res: any) => {
        // this.folder[this.findIndexdossierById(id)].publier = lastValue;
        if (lastValue) {
          this.toastr.success(`Test Publié`, '', {
            timeOut: 4000
          });
        }
        else {
          this.toastr.success(`Test non Publié`, '', {
            timeOut: 4000
          });
        }
      })
    } else {
      if (lastValue) {
        this.toastr.warning(`Impossible de publier ce Test\nl'offre qui lui est associé doit être activé`, '', {
          timeOut: 4000
        });
      }
    }
    window.location.reload();
  }

  activateOffer(offer: any, lastValue: boolean) {
    this.offreS.updatePublier({ publier: lastValue }, offer.id).subscribe(response => {
      console.log('offre ID : '+offer.id);
      if (!response.error) {
        if (lastValue) {
          this.toastr.success(`Offre publiée`, '', {
            timeOut: 4000
          });
        }
        else {
          this.toastr.success(`Offre non publiée`, '', {
            timeOut: 4000
          });
          this.quizS.updateQuizStatePublished(offer.quizInOffer[0]?.id, { publier: false }).subscribe((res: any) => {
            this.toastr.success(`Test associé non publié`, '', {
              timeOut: 4000
            });
          })
        }
      }
      else {
        this.toastr.error(`Une erreur est survenue`, '', {
          timeOut: 4000
        });
      }
      window.location.reload();
    })
  }
  // selected: any;
  // checked = false;
  // indeterminate = false;
  // allReponse = [];
  // idDescr = 0;
  // selectOption = false;
  // selectMultiple = false;
  // trueOrFalse = false;
  // textBox = false;
  // uploadFile = false;
  // listQuestion = [
  //   {
  //     nom: 'choix 1'
  //   },
  //   {
  //     nom: 'CHOIX MUTIPLES'
  //   },
  //   {
  //     nom: 'VRAI OU FAUX'
  //   },
  //   {
  //     nom: 'A CLASSEMENT HIERARCHIQUE'
  //   },
  //   {
  //     nom: 'REDACTION'
  //   },
  //   {
  //     nom: 'AUDIO'
  //   },
  //   {
  //     nom: 'VIDEO'
  //   }
  // ];
  // selectQuestion(event) {
  //   if (event.nom.includes('choix')) {
  //     this.selectOption = true;
  //     this.selectMultiple = false;
  //     this.trueOrFalse = false;
  //     this.textBox = false;
  //     this.uploadFile = false;
  //   } else if (event.nom.includes('MUTIPLES')) {
  //     this.selectMultiple = true;
  //     this.trueOrFalse = false;
  //     this.textBox = false;
  //     this.selectOption = false;
  //     this.uploadFile = false;
  //   } else if (event.nom.includes('VRAI')) {
  //     this.trueOrFalse = true;
  //     this.textBox = false;
  //     this.selectOption = false;
  //     this.selectMultiple = false;
  //     this.uploadFile = false;
  //   } else if (event.nom.includes('REDACTION')) {
  //     this.textBox = true;
  //     this.selectOption = false;
  //     this.selectMultiple = false;
  //     this.trueOrFalse = false;
  //     this.uploadFile = false;
  //   } else if (event.nom.includes('AUDIO') || event.nom.includes('VIDEO')) {
  //     this.textBox = false;
  //     this.selectOption = false;
  //     this.selectMultiple = false;
  //     this.trueOrFalse = false;
  //     this.uploadFile = true;
  //   }
  // }
  // ngOnInit() {
  //   this.allReponse.push({ id: 0, reponse: '', isReponse: false })
  // }
  // valid() {

  // }
  // select(e) {
  //   console.log(e)
  //   this.allReponse.forEach((el: any) => {
  //     el.isReponse = false;
  //   })
  // }
  // nextQuest() {
  //   this.listQuestion = [
  //     {
  //       nom: 'choix 1'
  //     },
  //     {
  //       nom: 'CHOIX MUTIPLES'
  //     },
  //     {
  //       nom: 'VRAI OU FAUX'
  //     },
  //     {
  //       nom: 'A CLASSEMENT HIERARCHIQUE'
  //     },
  //     {
  //       nom: 'REDACTION'
  //     },
  //     {
  //       nom: 'AUDIO'
  //     },
  //     {
  //       nom: 'VIDEO'
  //     }
  //   ];
  //   this.selectOption = false;
  //   this.selectMultiple = false;
  //   this.trueOrFalse = false;
  //   this.textBox = false;
  //   console.log(this.allReponse)
  // }
  // addLangue() {
  //   this.idDescr++;
  //   this.allReponse.push({ id: this.idDescr, reponse: '', isReponse: '' });
  // }
  // popLangue() {
  //   if (this.allReponse.length > 1) {
  //     this.allReponse.pop();
  //   }
  // }
}
