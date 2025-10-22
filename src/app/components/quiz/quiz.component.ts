import { Component, OnInit } from '@angular/core';
import { Option, Question, Quiz, QuizConfig, ResponseQuizz } from '../../models';
import { DataService } from 'src/app/services/data.service';
import { QuizService } from 'src/app/services/quiz.service';
import { PostulationService } from 'src/app/services/postulation.service';
import { MailerService } from 'src/app/services/mailer.service';


import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { OffreService } from 'src/app/services/offre.service';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup } from '@angular/forms';
import { FeatureService, FeatureMode } from '../../services/feature.service';



@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  form: FormGroup;
  timer_stopped: Boolean = false;
  postulation: any;
  // Redaction
  public EditorRedaction = ClassicEditor;
  public configRedaction = {
    placeholder: '',
  };
  // Essai
  public EditorEssai = ClassicEditor;
  public configEssai = {
    placeholder: "Essai",
  }
  isStart: Boolean;

  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  countAnswer = [];
  quizName: string;
  config: QuizConfig = {
    allowBack: true,
    allowReview: true,
    autoMove: false,  // if true, it will move to next question automatically when answered.
    duration: 20,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    pageSize: 1,
    requiredAll: false,  // indicates if you must answer all the questions before submitting.
    richText: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    showClock: false,
    showPager: true,
    theme: 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  color = '';
  isLoading: Boolean = false;
  message: string;
  offreId: number;
  blocked_start_button: Boolean = false;
  datarsp: any[] = [];
  point: number = 0;
  total_point: number = 0;
  responseOfQuestion: any[] = [];
  blobMedia: any[] = [];
  formData: FormData = new FormData();
  constructor(
    private dataS: DataService,
    private socket: Socket,
    private postulationS: PostulationService,
    private quizS: QuizService,
    private offreS: OffreService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private mailerService: MailerService
  ) { }


  setBlob(value: any) {
    this.blobMedia.push(value);
  }



  // async uploadFile() {
  //   if (this.blob) {
  //     // console.log(this.blob);
  //     // let blob = await fetch(this.blob).then(r => { return r.blob() })
  //     //   .then(blobFile => { console.log(blobFile); return new Blob([blobFile], { type: "audio/wav" }) });
  //     let file: File = new File([this.blob.blob], this.blob.title);
  //     // let filename = file.name.split("/");
  //     // console.log(file);
  //     // this.formData.append('dataUrl', this.blobUrl);
  //     this.formData.append('fileAudio', file);
  //     // new Response(this.formData).text().then(resp => { console.log(resp) });
  //     // console.log()
  //     // console.log(this.formData);
  //     this.postulationS.updateFileResponses(this.userId, this.offreId, this.formData).subscribe(response => {
  //       console.log(response);
  //     })
  //   }
  // }

  ngOnInit() {

    this.isStart = false;

    this.offreId = parseInt(this.route.snapshot.params.id);

    if (!localStorage.getItem('idUser') || !this.offreId) {
      this.router.navigateByUrl('**');
    }
    else {
      this.postulationS.getPostulation(parseInt(localStorage.getItem('idUser')), this.offreId).subscribe(response => {
        if (response.data.testPassed === 2) {
          this.blocked_start_button = true;
          alert("Vous avez déjà fait ce test");
          this.router.navigateByUrl('**');
        }
      })

      this.quizS.findOneByOffer(this.offreId).subscribe(data => {
        console.log(data);
        this.quiz = new Quiz(data.quizz);
        this.permuteQuestionHierarchic();
        console.log((this.quiz));
        // console.log(this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size));
        this.pager.count = data.quizz.questions.length;
        this.startTime = new Date();
        this.ellapsedTime = '00:00';

        for (let index = 0; index < this.quiz.questions.length; index++) {
          this.quiz.questions[index].responses = new ResponseQuizz(null);
          this.quiz.questions[index].responses.responseRedaction = "";
        }
      });
    }

  }

  permuteQuestionHierarchic() {
    for (let index = 0; index < this.quiz.questions.length; index++) {
      if (this.quiz.questions[index].TypeQuestionId === 3) {
        for (let i = this.quiz.questions[index].options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = this.quiz.questions[index].options[i];
          this.quiz.questions[index].options[i] = this.quiz.questions[index].options[j]
          this.quiz.questions[index].options[j] = temp;
        }
      }
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  demarrer() {
    
    this.isStart = true; 

    this.offreS.updatePostulation({ testDate: new Date(), step: 1, testPassed: 1, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
      .subscribe(response => {
        this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
      });
    
      this.timer = setInterval(() => { this.tick(); }, 1000);
    
    const duree = this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size)[0].timer.toString();

    if (duree.includes('s')) {
      setTimeout(() => {
        this.duration = this.parseTime(parseInt(duree.slice(0, -1)));
      }, 5000);
      this.config.duration = parseInt(duree.slice(0, -1));
    } else if (duree.includes('mn')) {
      this.duration = this.parseTime(parseInt(duree.slice(0, -2)) * 60);
      this.config.duration = parseInt(duree.slice(0, -2)) * 60;
    }


  }

  tick() {
    // alert("ato");
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      if (this.pager.index < this.pager.count) {

        this.goTo(this.pager.index + 1);
      } else if (this.pager.index === this.pager.count) {
        this.validate();
        console.log('validate' + 142)
      }

    }
    this.ellapsedTime = this.parseTime(diff);


    if (this.config.duration < 30) {
      if (diff > (this.config.duration - 5)) {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.config.duration < 2 * 60) {
      if (diff > (this.config.duration - 10)) {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.config.duration < 10 * 60) {
      if (diff > (this.config.duration - 30)) {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.config.duration > 10 * 60) {
      if (diff > (this.config.duration - 60)) {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    }

    /*
    
    if (this.duration === '00:10') {
      if (this.ellapsedTime > '00:05') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '00:20') {
      if (this.ellapsedTime > '00:15') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '00:30') {
      if (this.ellapsedTime > '00:20') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '01:00') {
      if (this.ellapsedTime > '00:50') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '05:00') {
      if (this.ellapsedTime > '04:30') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '10:00') {
      if (this.ellapsedTime > '09:00') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    } else if (this.duration === '15:00') {
      if (this.ellapsedTime > '14:00') {
        this.color = 'red cardcontainer';
      } else {
        this.color = '';
      }
    }
    */

  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    /* this.quiz.questions[this.pager.index + 1].TypeQuestionId === 1 */
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }
  select2(question: Question, option: Option) {
    this.countAnswer.push(option);
    console.log(this.countAnswer.length, question.options);
    question.options.forEach((x) => { if (x.id !== option.id) { x.selected = false; } });
  }
  onCheck(question: Question) {
    console.log(question);
    const result = this.isCorrect(question);
    console.log(result);
  }
  getHierarchicalQuestion(questions: Question[]) {
    const result = [];
    questions.forEach(question => {
      if (question.TypeQuestionId === 3) {
        result.push(question);
      }
    });
    return result;
  }

  drop(event: CdkDragDrop<Option[]>) {
    const questions = this.getHierarchicalQuestion(this.quiz.questions);
    questions.forEach(question => {
      moveItemInArray(question.options, event.previousIndex, event.currentIndex);
      console.log((question));
    });
  }
  onSelect(question: Question, option: Option) {
    console.log(question);
    if (this.pager.index === this.pager.count) {
      this.validate();
      console.log('validate' + 311);

    } else {
      if (question.TypeQuestionId === 1) {
        question.options.forEach((x) => { if (x.id !== option.id) { x.selected = false; } });
      }
      // else if (question.TypeQuestionId === 2) {
      //   question.options.forEach((x) => { if (x.id === option.id) { x.selected = x.selected; } });
      // }
      else if (question.TypeQuestionId === 3) {
        if (option.name.includes('test')) {
          question.options.forEach((x) => {
            //console.log(x);
            x.isAnswer = true;
            if (x.id !== option.id) {
              x.selected = false;
            }
          });
        } else {
          question.options.forEach((x) => {
            //console.log(x)
            x.isAnswer = false;
            if (x.id !== option.id) {
              x.selected = false;
            }
          });
        }
      }
    }


  }
  onSelectedAudio(event: any) {

  }
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  goTo(index: number) {
    this.offreS.updatePostulation({ step: (index + 1 <= this.pager.count ? index + 1 : index), offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
      .subscribe(response => {
        this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
      });
    let file: File;
    if (this.quiz.questions[index - 1].TypeQuestionId === 5 && this.blobMedia) {
      let grid: number = 0;
      for (let indexCritere = 0; indexCritere < this.quiz.questions[index - 1].criteres.length; indexCritere++) {
        grid += parseInt(this.quiz.questions[index - 1].criteres[indexCritere].point);
      }
      this.responseOfQuestion.push({ questionId: this.quiz.questions[index - 1].id, answers: this.blobMedia[this.blobMedia.length - 1].title, grid: grid, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      this.formData.set('fileAudio', new File([this.blobMedia[this.blobMedia.length - 1].blob], this.blobMedia[this.blobMedia.length - 1].title));
    }
    else if (this.quiz.questions[index - 1].TypeQuestionId === 6 && this.blobMedia) {
      let grid: number = 0;
      for (let indexCritere = 0; indexCritere < this.quiz.questions[index - 1].criteres.length; indexCritere++) {
        grid += parseInt(this.quiz.questions[index - 1].criteres[indexCritere].point);
      }
      this.responseOfQuestion.push({ questionId: this.quiz.questions[index - 1].id, answers: this.blobMedia[this.blobMedia.length - 1].title, grid: grid, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      this.formData.set('fileVideo', new File([this.blobMedia[this.blobMedia.length - 1].blob], this.blobMedia[this.blobMedia.length - 1].title));
    }


    // if (this.quiz.questions[index].TypeQuestionId === 6) {
    //   alert("Video" + JSON.stringify(this.quiz.questions[index]));
    // }
    // verification si la question indice-1 index est vrai
    this.isCorrect(this.quiz.questions[index - 1]);
    if (this.quiz.questions.length === (index + 1)) { this.message = 'Vous arrivez sur la dernière question' }
    if (index >= 0 && index < this.pager.count && !this.timer_stopped) {
      // alert("mbola makato");
      this.pager.index = index;
      this.mode = 'quiz';
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      console.log(this.filteredQuestions);


      const duree = this.filteredQuestions[0].timer.toString();

      if (duree.includes('s')) {
        this.duration = this.parseTime(parseInt(duree.slice(0, -1)));
        this.config.duration = parseInt(duree.slice(0, -1));
      } else if (duree.includes('mn')) {
        this.duration = this.parseTime(parseInt(duree.slice(0, -2)) * 60);
        this.config.duration = parseInt(duree.slice(0, -2)) * 60;
      }

    } else {
      this.validate()
      console.log('validate' + 311);
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Répondu' : 'Non Répondu';
  }

  isCorrect(question: Question) {
    if (question.TypeQuestionId === 1 && new String(question.options[0].isAnswer).toLowerCase() === new String(question.options[0].selected).toLowerCase()) {
      this.point += parseInt(question.criteres[0].point);
      this.offreS.updatePostulation({ note: this.point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
        .subscribe(response => {
          // alert(`${JSON.stringify(response)}`);
          this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
        });
      this.responseOfQuestion.push({ questionId: question.id, answers: question.options[0].selected, pointWin: parseInt(question.criteres[0].point), pointLost: 0, grid: parseInt(question.criteres[0].point), offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      return 'correct';
    }
    else if (question.TypeQuestionId === 1 && new String(question.options[0].isAnswer).toLowerCase() !== new String(question.options[0].selected).toLowerCase()) {
      this.responseOfQuestion.push({ questionId: question.id, answers: question.options[0].selected, pointWin: 0, pointLost: parseInt(question.criteres[0].point), grid: question.criteres[0].point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      return 'wrong';
    }
    if (question.TypeQuestionId === 3) {
      let result = [];
      for (let index = 0; index < question.options.length; index++) {
        // this.responseOfQuestion.push({ que stionId: question.id, answers: question.options[index].name, rang: question.options[index].rang, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
        result.push(`${question.options[index].name} -> ${question.options[index].rang}`);
      }
      for (let index = 0; index < question.options.length - 1; index++) {
        if (question.options[index].rang > question.options[index + 1].rang) {
          // this.responseOfQuestion.push({ questionId: question.id, answers: question.options[0].selected, pointWin: 0, pointLost: parseInt(question.criteres[0].point), grid: question.criteres[0].point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
          return 'wrong';
        }
      }
      this.point += parseInt(question.criteres[0].point);
      this.offreS.updatePostulation({ note: this.point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
        .subscribe(response => {
          // alert(`${JSON.stringify(response)}`);
          this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
        });
      this.responseOfQuestion.push({ questionId: question.id, answers: result.join(", "), pointWin: question.criteres[0].point, pointLost: 0, grid: question.criteres[0].point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      return 'correct';
    }
    else if (question.TypeQuestionId === 2) {
      const answers = [];
      let result = [];
      for (let index = 0; index < question.options.length; index++) {
        if (question.options[index].selected) {
          result.push(question.options[index].name);
          // this.responseOfQuestion.push({ questionId: question.id, answers: question.options[index].name, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
        }
        if (question.options[index].isAnswer) {
          answers.push(index);
        }
      }
      this.responseOfQuestion.push({ questionId: question.id, answers: `Les réponses cochés: ${result.join(",")}`, pointWin: parseInt(question.criteres[0].point), pointLost: 0, grid: parseInt(question.criteres[0].point), offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) });
      for (let index = 0; index < answers.length; index++) {
        if (new String(question.options[answers[index]].selected).toLowerCase() !== new String(question.options[answers[index]].isAnswer).toLowerCase()) {
          // this.responseOfQuestion.push({ questionId: question.id, answers: question.options[0].selected, pointWin: 0, pointLost: parseInt(question.criteres[0].point), grid: parseInt(question.criteres[0].point) });
          return 'wrong';
        }
      }
      this.point += parseInt(question.criteres[0].point);
      this.offreS.updatePostulation({ note: this.point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
        .subscribe(response => {
          // alert(`${JSON.stringify(response)}`);
          this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
        });
      return 'correct';
    }
    else if (question.TypeQuestionId === 4) {
      let grid = 0;
      for (let indexCritere = 0; indexCritere < question.criteres.length; indexCritere++) {
        grid += parseInt(question.criteres[indexCritere].point);
      }
      this.responseOfQuestion.push({ questionId: question.id, answers: question.responses.responseRedaction, offreId: this.offreId, grid: grid, userId: parseInt(localStorage.getItem('idUser')) });
      return "a confirmer par le recruteur";
    }
    else if (question.TypeQuestionId === 5) {
      return "a confirmer par le recruteur";
    }
    else if (question.TypeQuestionId === 6) {
      return "a confirmer par le recruteur";
    }
    // return question.options.every(x => {
    //   // alert(new String(x.selected).toLowerCase() === new String(x.isAnswer).toLowerCase());
    //   return new String(x.selected).toLowerCase() === new String(x.isAnswer).toLowerCase()
    // }) ? alert('correct') : alert('wrong');
    // }

  }

  getTotalPoint() {
    for (let index_question = 0; index_question < this.quiz.questions.length; index_question++) {
      for (let index_critere = 0; index_critere < this.quiz.questions[index_question].criteres.length; index_critere++) {
        this.total_point += parseInt(this.quiz.questions[index_question].criteres[index_critere].point);
      }
    }
    return this.total_point;
  }

  validate() {
    this.isLoading = true;
    this.mode = 'result';
    this.pager.index = 10;
    this.timer_stopped = true;
    clearInterval(this.timer);
    this.offreS.updatePostulation({ testPassed: 2, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
      .subscribe(response => {
        // alert(`${JSON.stringify(response)}`);
        this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
      });

    const answers = [];
    this.message = '';
    this.quiz.questions.forEach(x => {
      // this.isCorrect(x);
      if (x.TypeQuestionId !== 3) {
        answers.push({ quizId: this.quiz.id, questionId: x.id, answered: x.answered });
        console.log(answers);
      } else {
        for (let i = 0; i < x.options.length; i++) {
          if (x.options[i].rang === i) {
            this.datarsp.push(false);
          } else {
            this.datarsp.push(true);
          }
        }
        if (this.datarsp.includes('false')) {
          console.log(false)
        }
        this.datarsp = [];
      }
    }
    );
    this.offreS.updatePostulation({ totalPoint: this.getTotalPoint(), note: this.point, offreId: this.offreId, userId: parseInt(localStorage.getItem('idUser')) })
      .subscribe(response => {
        // alert(`${JSON.stringify(response)}`);
        // envoyer email au candidat
        this.isLoading = false;
        // this.mailerService.sendMail({ email_recipient: response.data.user.email, email_subject: "resultat du test Talent sourcing", email_content: "Test" })
        //   .subscribe(response => {
        //     this.toastr.success(`Le résultat du test a été envoyé par email. Veuillez consulter votre email`);
        //     this.isLoading = false;
        //   })
        this.socket.emit(`total_point`, { total_point: this.getTotalPoint() });
        this.socket.emit(`update_postulation`, { message: response.message, data: response.data });
      });
    // console.log(this.responseOfQuestion);
    this.formData.append('listResponseTest', JSON.stringify(this.responseOfQuestion));
    this.postulationS.createPostulationResponses(parseInt(localStorage.getItem('idUser')), this.offreId, this.formData)
      .subscribe(response => {
        this.toastr.success(`Vos réponses sont envoyées au récruteur`);
        this.isLoading = false;
      })
    this.mode = 'result';
    // new Response(this.formData).text().then(resp => { console.log(resp) });
    // stocker les reponses de test de candidat
  }
}
