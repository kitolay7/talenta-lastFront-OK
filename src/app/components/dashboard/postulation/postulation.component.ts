import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { from } from 'rxjs';
import { OffreService } from '../../../services/offre.service';
import { PostulationService } from '../../../services/postulation.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { MailerService } from 'src/app/services/mailer.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
  styleUrls: ['./postulation.component.scss']
})
export class PostulationComponent implements OnInit {
  title = "Etat des candidatures";
  offerDetail: any;
  postulations = [];
  offreId: number;
  userId: number;
  selectAll: Boolean = false;
  isLoading: Boolean = false;
  listPostulations = [];
  manualNotation = false;
  finish = false;
  public modalSendMail: BsModalRef;
  indexCandidat: number;
  formContact: FormGroup;
  fullname: string;
  totalPoint: number;
  // private _postulationSubscription: Subscription;
  constructor(
    private socket: Socket,
    private offreS: OffreService,
    private postulationS: PostulationService,
    private route: ActivatedRoute,
    private mailerService: MailerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private userS: UserService,
  ) {
    this.createformContact();
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params.offreId;
    this.offreId = parseInt(params);

    const userId = parseInt(localStorage.getItem('idUser'));
    this.offreS.getUsersByOffer(params).subscribe(response => {
      this.postulations = response.data;
      // concatenation with selected
      for (let index = 0; index < this.postulations.length; index++) {
        this.postulations[index] = { ...this.postulations[index], ...{ selected: false } };
      }
      // valueof this.postulations
      // console.log(this.postulations);
    })
    this.socket.fromEvent<any>(`user_postuled_offer_${params}`).subscribe(response => {
      this.postulationS.getPostulation(JSON.parse(response).userId, JSON.parse(response).offreId).subscribe(response => {
        this.postulations.push(response.data);
      });
    })
    this.socket.fromEvent<any>(`alert_update_offre_${params}`).subscribe(response => {
      let postulation_updated = JSON.parse(response);

      let index = this.findIndexByUserAndOffer(parseInt(postulation_updated.data.userId), parseInt(postulation_updated.data.offreId));
      this.postulations[index] = postulation_updated.data;
    })
    this.offreS.getQuestionsByOffer(params).subscribe(response => {
      // console.log(response.data);
      // console.log(response.data.quizz.questions.map(question => {
      //   question.criteria_point_questions.map(criteria_point_question => {
      //     parseInt(criteria_point_question.point)
      //   })
      // }));
      let totalTemp = [];
      response.data.quizz.questions.forEach(question => {
        question.criteria_point_questions.forEach(critere => {
          totalTemp.push(parseInt(critere.point))
        })
      })
      this.totalPoint = totalTemp.reduce((x, y) => x + y, 0);
      // console.log(this.totalPoint);

      const questions = response.data.quizz.questions;
      questions.forEach(question => {
        if (question.TypeQuestionId > 3) {
          this.manualNotation = true;
        }
      })
    })
  }

  observationIsChanged(index) {
    // alert(this.postulations[index].observation);
    this.offreS.updatePostulation(this.postulations[index]).subscribe(async response => {
      this.socket.emit(`update_postulation`, { message: response.message, data: this.postulations[index] });
      await this.toastr.success(`Cet etat de postulation a été mise à jour avec succès`, '', {
        timeOut: 5000
      });
    })
    this.findIndexByUserAndOffer(this.postulations[index].userId, this.postulations[index].offreId);
  }

  findIndexByUserAndOffer(userId, offerId) {
    let a = this.postulations.findIndex(postulation => (postulation.userId === userId && postulation.offreId === offerId))
    return a;
  }

  getDecision(postulation: any) {
    if (postulation.totalPoint === 0 || !postulation.noted_main) {
      postulation.decision = "En attente";
      return postulation.decision;
    }
    else {
      if (postulation.note < (postulation.totalPoint * postulation.offre.passe)) {
        postulation.decision = "Refusé";
        return postulation.decision;
      }
      else {
        postulation.decision = "Entretien";
        return postulation.decision;
      }
    }
  }

  getTestEvolution(codeEvaluate: number) {
    switch (codeEvaluate) {
      case 0:
        return "En attente";
      case 1:
        return "En cours";
      case 2:
        return "Terminé";
    }
  }

  sendMailSelected() {
    this.isLoading = true;
    const postulationsSelected = this.postulations.map((postulation, index) => {
      if (postulation.selected) {
        this.postulations[index] = { ...this.postulations[index], ...{ subject: `Résultat du test associé à ${this.postulations[index].offre.titre}` } };
        return this.postulations[index];
      }
    }).filter(postulation => { return postulation !== undefined });
    // console.log(JSON.stringify({ data: postulationsSelected }))

    this.mailerService.sendMailGroup({ data: postulationsSelected })
      .subscribe(response => {
        if (!response.error) {
          for (let index = 0; index < response.data.length; index++) {
            this.toastr.success(`Le resultat de test de ${response.data[index].name} a été envoyé au courrier ${response.data[index].info.accepted[0]}`, '', {
              timeOut: 5000
            });
          }
          this.isLoading = false;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        else {
          this.toastr.error('Une erreur est survenue', '', {
            timeOut: 10000
          });
          this.isLoading = false;
        }
      })
  }

  toggleSelectAll(selectAllValue: Boolean) {
    if (selectAllValue) {
      for (let index = 0; index < this.postulations.length; index++) {
        this.postulations[index].selected = true;
      }
    } else {
      for (let index = 0; index < this.postulations.length; index++) {
        this.postulations[index].selected = false;
      }
    }
  }

  toggle(selectValue: Boolean) {
    if (!selectValue) {
      this.selectAll = false;
    }
  }
  extraire() {
    const headerList = ['Nom', 'Prénoms', 'Titre offre', 'Contrat', 'Publication', 'Date de Test', 'Test', 'Etape', 'Points', 'Décision', 'Observation'];
    console.log(this.postulations)
    this.postulations.forEach(postulation => {

      let listPostulation = [
        postulation.user.profile.lastName,
        postulation.user.profile.firstName,
        postulation.offre.titre,
        postulation.offre.post,
        postulation.offre.publicationDate.slice(0, 10),
        postulation.testDate.slice(0, 10),
        this.getTestEvolution(postulation.testPassed),
        postulation.step,
        postulation.note + '/20',
        this.getDecision(postulation),
        (postulation.observation || ''),
      ]

      this.listPostulations.push(listPostulation);
    });
    const csvData = this.ConvertToCSV(this.listPostulations, headerList);
    console.log(csvData)

    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dwldLink = document.createElement('a');
    dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', 'Rapport-Candidats-Talenta-Sourcing.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  // tslint:disable-next-line: typedef
  ConvertToCSV(objArray, headerList) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    console.log(array);
    let str = '';
    let row = 'No.,';
    // tslint:disable-next-line: forin
    for (const index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      // tslint:disable-next-line: forin
      for (let j = 0; j < headerList.length; j++) {
        line += ',' + array[i][j];
      }
      str += line + '\r\n';

    }
    return str;
  }


  createformContact() {
    this.formContact = new FormGroup({
      objet: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  sendContact() {
    const mail = {
      email: this.postulations[this.indexCandidat].user.email,
      objet: this.formContact.controls.objet.value,
      message: this.formContact.controls.message.value,
    }
    console.log(mail)
    this.userS.sendMailCandidat(mail).subscribe((response: any) => {
      if (response.error === false) {
        this.toastr.success('Votre message a bien été envoyé', '', {
          timeOut: 5000
        });
        this.modalSendMail.hide();
      } else {
        this.toastr.error(response.message, '', {
          timeOut: 4000
        });
      }
    });

  }

  sendMailModal(template: TemplateRef<any>, index: number, postulation: any) {
    this.indexCandidat = index;
    console.log(this.postulations[index])
    console.log(postulation)
    this.fullname = `${postulation.user.profile.firstName} ${postulation.user.profile.lastName}`
    this.formContact.reset();
    this.modalSendMail = this.modalService.show(template,
      Object.assign({}, { class: 'sendClass', size: 'lg', ignoreBackdropClick: true })
    );
  }
}
