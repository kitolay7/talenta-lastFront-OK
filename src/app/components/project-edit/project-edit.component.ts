import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { OffreService } from 'src/app/services/offre.service';
import { Quiz, Question, Option, ResponseQuizz, CriteriaPointQuestion } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Offres } from '../../models/offres';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  // autocomplete
  title = "AU CŒUR D’UN RECRUTEMENT DE QUALITE";
  myControlFreeOffers = new FormControl();
  optionsOffers: any[];
  filteredOptionsOffers: Observable<string[]>;
  quizName: string;
  offreId: number;
  ids = { "questions": [], "criteres": [], "responses": [] };
  quiz: Quiz;
  responses: ResponseQuizz[];
  questions: Question[] = [];
  nbTrueFalse: number = 0;
  nbMultipleChoise: number = 0;
  nbClassement: number = 0;
  nbRedaction: number = 0;
  nbAudio: number = 0;
  nbVideo: number = 0;
  isLoading = false;
  allReponse = [];
  addquestion = new FormGroup({
    offer: new FormControl('', [
      Validators.required,
    ]),
    name_dir: new FormControl('', [
      Validators.required,
    ]),
    fiche_dir: new FormControl('', [
      Validators.required,
    ]),
    author_dir: new FormControl('', [
      Validators.required,
    ]),
  });
  showQuest: boolean;
  idUser: any;
  currentUserSubject: BehaviorSubject<any>;
  offres: Offres[] = [];
  idDescr = 0;
  idQuiz: number;



  constructor(private toastr: ToastrService, private userServ: UserService, private offreService: OffreService, private _fb: FormBuilder, private quizS: QuizService, private route: ActivatedRoute, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
    if (this.currentUserSubject.getValue() !== null) {
      const a = JSON.parse(localStorage.getItem('idUser'));
      this.userServ.setUser(a);
      this.idUser = a;

    }

    this.quizS.findOneQuizById(this.route.snapshot.params.id).subscribe(response => {
      console.log(response);
      this.offreId = response.data?.offerInQuiz[0]?.id;
      this.offreService.getFreeCurrentOffers(this.idUser, this.offreId)
        .subscribe
        (
          data => {
            this.offres = data.data;
            // this.optionsOffers = data.data.map(offre => { return { id: offre.id, titre: offre.titre } });
            // console.log(this.optionsOffers);
            // this.filteredOptionsOffers = this.myControlFreeOffers.valueChanges
            //   .pipe(
            //     startWith(''),
            //     map(value => this._filter(value))
            //   );
          }
        )
      this.quizName = response.data.name;
      this.addquestion = this._fb.group({ offer: this.offreId });
      // console.log(this.addquestion.controls);
      this.idQuiz = response.data.id;
      for (let indexQuestion = 0; indexQuestion < response.data.questions.length; indexQuestion++) {
        let question = new Question(response.data.questions[indexQuestion]);
        question.setEnunciate(response.data.questions[indexQuestion].enunciate);
        question.setCriteres(response.data.questions[indexQuestion].criteria_point_questions);
        question.setTimer(response.data.questions[indexQuestion].timer);
        question.setReponse(response.data.questions[indexQuestion]?.options[0]?.choices);
        question.setOffreId(this.offreId);
        console.log(question);
        switch (question.TypeQuestionId) {
          case 1:
            // console.log(question.options[0].isAnswer);
            // let indexSelected = this.trueorFalse.findIndex(trueFalse => (trueFalse.value === question.options[0].isAnswer));
            // this.selecteitem(this.trueorFalse[indexSelected]);
            // console.log(this.addtruefalse.controls.itemRowsTrueFalse['controls'])
            this.ids.questions.push(question.id);
            this.ids.criteres.push(question.criteres[0].id);
            this.ids.responses.push(question.options[0].id);
            this.formArrTrueFalse.push(
              this._fb.group({
                id: [question.id],
                questionTypeId: [question.TypeQuestionId],
                question_name: [question.enunciate],
                rep1: [question.options[0].isAnswer],
                idRep1: [question.options[0].id],
                timing: [question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2)],
                unit: [question.timer.includes('s') ? 's' : 'mn'],
                point: [parseInt(question.criteres[0].point)],
                critereId: [parseInt(question.criteres[0].id)]
              })
            );
            this.nbTrueFalse++;
            break;
          case 2:
            // this.addMultipleChoiseForm();
            this.ids.questions.push(question.id);
            this.ids.criteres.push(question.criteres[0].id);

            this.nbMultipleChoise++;
            // console.log(question.options.length);
            let formChoice = {}
            formChoice[`id`] = question.id;
            formChoice[`questionTypeId`] = question.TypeQuestionId;
            formChoice[`question_name`] = question.enunciate;
            formChoice[`point`] = question.criteres[0].point;
            formChoice[`critereId`] = question.criteres[0].id;
            formChoice[`timing`] = question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2);
            formChoice[`unit`] = question.timer.includes('s') ? 's' : 'mn';
            formChoice[`itemMultipleChoices`] = new FormArray([]);
            for (let indexMultiple = 0; indexMultiple < question.options.length; indexMultiple++) {
              this.ids.responses.push(question.options[indexMultiple].id);
              formChoice[`itemMultipleChoices`].push(this._fb.group({
                id: question.options[indexMultiple].id,
                choice: question.options[indexMultiple].name,
                isResponse: question.options[indexMultiple].isAnswer
              }));
            }
            console.log(formChoice);
            this.formArrMultipleChoise.push(this._fb.group(formChoice));
            break;
          case 3:
            this.ids.questions.push(question.id);
            this.ids.criteres.push(question.criteres[0].id);
            // this.ids.responses.push(question.options[0].id);

            this.nbClassement++;
            let formClassement = {};
            formClassement[`id`] = question.id;
            formClassement[`questionTypeId`] = question.TypeQuestionId;
            formClassement[`question_name`] = question.enunciate;
            formClassement[`point`] = question.criteres[0].point;
            formClassement[`critereId`] = question.criteres[0].id;
            formClassement[`timing`] = question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2);
            formClassement[`unit`] = question.timer.includes('s') ? 's' : 'mn';
            formClassement[`itemClassementChoices`] = new FormArray([]);
            for (let indexClassement = 0; indexClassement < question.options.length; indexClassement++) {
              this.ids.responses.push(question.options[indexClassement].id);
              formClassement[`itemClassementChoices`].push(this._fb.group({
                id: question.options[indexClassement].id,
                choice: question.options[indexClassement].name
              }))
            }
            this.formArrClassement.push(this._fb.group(formClassement));
            break;
          case 4:
            this.ids.questions.push(question.id);
            this.ids.responses.push(question?.options[0]?.id);

            this.nbRedaction++;
            let formRedaction = {};
            formRedaction[`id`] = question.id;
            formRedaction[`questionTypeId`] = question.TypeQuestionId;
            formRedaction[`question_name`] = question.enunciate;
            //formRedaction[`point`] = question.criteres[0].point;
            formRedaction[`timing`] = question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2);
            formRedaction[`unit`] = question.timer.includes('s') ? 's' : 'mn';
            formRedaction[`texte`] = question.responses;
            formRedaction[`responseId`] = question?.options[0]?.id;
            formRedaction[`itemRedactionChoices`] = new FormArray([]);
            for (let indexRedactionCritere = 0; indexRedactionCritere < question.criteres.length; indexRedactionCritere++) {
              this.ids.criteres.push(question.criteres[indexRedactionCritere].id);
              formRedaction[`itemRedactionChoices`].push(this._fb.group({
                id: question.criteres[indexRedactionCritere].id,
                choice: question.criteres[indexRedactionCritere].wording,
                response: question.criteres[indexRedactionCritere].point
              }))
            }
            this.formArrRedaction.push(this._fb.group(formRedaction));
            break;
          case 5:
            this.ids.questions.push(question.id);
            this.ids.responses.push(question.options[0].id);
            this.nbAudio++;
            let formAudio = {}
            formAudio[`id`] = question.id;
            formAudio[`questionTypeId`] = question.TypeQuestionId;
            formAudio[`question_name`] = question.enunciate;
            //formAudio[`point`] = question.criteres[0].point;
            formAudio[`timing`] = question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2);
            formAudio[`unit`] = question.timer.includes('s') ? 's' : 'mn';
            formAudio[`texte`] = question.responses;
            formAudio[`audio`] = ``;
            formAudio[`responseId`] = question.options[0].id;
            formAudio[`itemAudioChoices`] = new FormArray([]);
            question.options[0].setTypeAudio(response.data.questions[indexQuestion].options[0].type_audio);
            formAudio[`audioRep`] = question.options[0].typeAudio.toString();
            for (let indexAudioCritere = 0; indexAudioCritere < question.criteres.length; indexAudioCritere++) {
              this.ids.criteres.push(question.criteres[indexAudioCritere].id);
              formAudio[`itemAudioChoices`].push(this._fb.group({
                id: question.criteres[indexAudioCritere].id,
                choice: question.criteres[indexAudioCritere].wording,
                response: question.criteres[indexAudioCritere].point
              }))
            }
            this.formArrAudio.push(this._fb.group(formAudio));
            break;
          case 6:
            this.ids.questions.push(question.id);
            this.ids.responses.push(question.options[0].id);
            this.nbVideo++;
            let formVideo = {};
            formVideo[`id`] = question.id;
            formVideo[`questionTypeId`] = question.TypeQuestionId;
            formVideo[`question_name`] = question.enunciate;
            //formVideo[`point`] = question.criteres[0].point;
            formVideo[`timing`] = question.timer.includes('s') ? question.timer.slice(0, -1) : question.timer.slice(0, -2);
            formVideo[`unit`] = question.timer.includes('s') ? 's' : 'mn';
            formVideo[`texte`] = question.responses;
            formVideo[`video`] = ``;
            formVideo[`responseId`] = question.options[0].id;
            formVideo[`itemVideoChoices`] = new FormArray([]);
            question.options[0].setTypeAudio(response.data.questions[indexQuestion].options[0].type_audio);
            formVideo[`videoRep`] = question.options[0].typeAudio.toString();
            for (let indexVideoCritere = 0; indexVideoCritere < question.criteres.length; indexVideoCritere++) {
              this.ids.criteres.push(question.criteres[indexVideoCritere].id);
              formVideo[`itemVideoChoices`].push(this._fb.group({
                id: question.criteres[indexVideoCritere].id,
                choice: question.criteres[indexVideoCritere].wording,
                response: question.criteres[indexVideoCritere].point
              }))
            }
            this.formArrVideo.push(this._fb.group(formVideo));
            break;
          case 7:
            break;
          default:
            break;
        }
        this.questions.push(question);
      }
      console.log(this.questions);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.optionsOffers);
    // return this.optionsOffers.map(offer => offer.titre).filter(option => option.toLowerCase().includes(filterValue));
    return this.optionsOffers.filter(option => {
      if (option.titre.toLowerCase().includes(filterValue)) {
        return option;
      }
    });
  }

  itemChoiceOnMultiple(): FormGroup {
    return this._fb.group({
      id: '',
      choice: ['', Validators.required],
      isResponse: false
    })
  }

  addItemOnMultipleChoice(index: number) {
    // let items = this.formArrMultipleChoise.get('itemMultipleChoices') as FormArray;
    // this.nbMultipleChoise++;
    this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.push(this.itemChoiceOnMultiple());
    // console.log(((this.addmultiplechoise.get('itemRowsMultipleChoise') as FormArray).controls[index].get('itemMultipleChoices') as FormArray));
    // (this.addmultiplechoise.get('itemRowsMultipleChoise') as FormArray).controls[index].get('itemMultipleChoices') as FormArray;
    // ((this.addmultiplechoise.get('itemRowsMultipleChoise') as FormArray).controls[index].get('itemMultipleChoices') as FormArray).push(this.itemChoiceOnMultiple());
    // console.log(this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.controls);
  }

  removeItemOnMultipleChoice(index: number) {
    if (this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.length > 1) {
      this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.removeAt(this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.length - 1);
      // this.nbMultipleChoise--;
    }
    // let items = this.formArrMultipleChoise.get('itemMultipleChoices') as FormArray;
    // let items = this.addmultiplechoise.get('itemRowsMultipleChoise')[index].get('itemMultipleChoices') as FormArray;
    // items.push(this.itemChoiceOnMultiple());
  }

  addLangue() {
    this.idDescr++;
    this.allReponse.push({ id: this.idDescr, reponse: '', isReponse: '' });
  }
  popLangue() {
    if (this.allReponse.length > 1) {
      this.allReponse.pop();
    }
  }

  ngOnInit(): void {
    // this.showQuest = true;
    // this.allReponse.push({ id: 0, reponse: '', isReponse: false })
    // get offres
    // get current user
    // True or False
    this.addtruefalse = this._fb.group({ itemRowsTrueFalse: this._fb.array([this.initItemRowsTrueFalse()]) });
    this.nbTrueFalse++;
    this.deleteRowTrueFalseForm(0);
    // Multiple Choise
    this.addmultiplechoise = this._fb.group({ itemRowsMultipleChoise: this._fb.array([this.initItemRowsMultipleChoise()]) });
    this.nbMultipleChoise++;
    this.deleteRowMultipleChoiseForm(0);
    // Classement
    this.addclassement = this._fb.group({ itemRowsClassement: this._fb.array([this.initItemRowsClassement()]) });
    this.nbClassement++;
    this.deleteRowClassementForm(0);
    // Rédaction
    this.addredaction = this._fb.group({ itemRowsRedaction: this._fb.array([this.initItemRowsRedaction()]) });
    this.nbRedaction++;
    this.deleteRowRedactionForm(0);
    // Audio
    this.addaudio = this._fb.group({ itemRowsAudio: this._fb.array([this.initItemRowsAudio()]) });
    this.nbAudio++;
    this.deleteRowAudioForm(0);
    // Video
    this.addvideo = this._fb.group({ itemRowsVideo: this._fb.array([this.initItemRowsVideo()]) });
    this.nbVideo++;
    this.deleteRowVideoForm(0);
  }

  scrollTo(section) {
    const el = document.querySelector('#' + section);
    //el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
    //console.log(y)
  }
  // Choix type de question

  addForm(questionType: number) {
    //this.questionTypeId = questionType;
    switch (questionType) {
      case 1:
        this.addTrueFalseForm();
        this.scrollTo('truefalse');
        break;
      case 2:
        this.addMultipleChoiseForm();
        this.scrollTo('multiplechoice');
        break;
      case 3:
        this.addClassementForm();
        this.scrollTo('classement');
        break;
      case 4:
        this.addRedactionForm();
        this.scrollTo('redaction');
        break;
      case 5:
        this.addAudioForm();
        this.scrollTo('audio');
        break;
      case 6:
        this.addVideoForm();
        this.scrollTo('video');
        break;
      case 7:
        break;
      default:
        break;
    }
  }

  // True or False

  trueorFalse = [
    {
      name: 'Vrai',
      isAnswer: false,
      value: true
    },
    {
      name: 'Faux',
      isAnswer: false,
      value: false
    }
  ];
  audioType = [
    {
      name: 'Télechargement du fichier audio',
      value: '1',
    },
  ];
  videoType = [
    {
      name: 'Télechargement du fichier video',
      value: '1',
    },
  ]
  public addtruefalse: FormGroup;

  get formArrTrueFalse() {
    return this.addtruefalse.get('itemRowsTrueFalse') as FormArray;
  }
  selecteitem(item) {
    this.trueorFalse.forEach((res: any) => {
      res.checked = false;
    });
    item.checked = true;
  }
  initItemRowsTrueFalse() {
    return this._fb.group({
      id: [''],
      questionTypeId: ['1'],
      question_name: ['', Validators.required],
      rep1: ['', Validators.required],
      timing: ['', Validators.required],
      unit: ['s', Validators.required],
      point: ['', Validators.required],
      idRep1: [''],
      critereId: ['']
    });
  }
  addTrueFalseForm() {
    this.formArrTrueFalse.push(this.initItemRowsTrueFalse());
    this.nbTrueFalse++;
  }
  deleteRowTrueFalseForm(index: number) {
    this.formArrTrueFalse.removeAt(index);
    this.nbTrueFalse--;
  }

  // Multiple Choise

  public addmultiplechoise: FormGroup;

  get formArrMultipleChoise() {
    return this.addmultiplechoise.get('itemRowsMultipleChoise') as FormArray;
  }

  initItemRowsMultipleChoise() {
    return this._fb.group({
      questionTypeId: ['2'],
      question_name: ['', Validators.required],
      itemMultipleChoices: this._fb.array([this.itemChoiceOnMultiple()]),
      timing: ['', Validators.required],
      unit: ['mn', Validators.required],
      point: ['', Validators.required],
      critereId: ['']
    });
  }
  addMultipleChoiseForm() {
    this.formArrMultipleChoise.push(this.initItemRowsMultipleChoise());
    this.nbMultipleChoise++;
  }
  deleteRowMultipleChoiseForm(index: number) {
    this.formArrMultipleChoise.removeAt(index);
    this.nbMultipleChoise--;
  }

  // Classement

  public addclassement: FormGroup;

  get formArrClassement() {
    return this.addclassement.get('itemRowsClassement') as FormArray;
  }

  initItemRowsClassement() {
    return this._fb.group({
      questionTypeId: ['3'],
      question_name: ['', Validators.required],
      itemClassementChoices: this._fb.array([this.itemChoiceOnClassement()]),
      timing: ['', Validators.required],
      unit: ['mn', Validators.required],
      point: ['', Validators.required],
    });
  }
  addClassementForm() {
    this.formArrClassement.push(this.initItemRowsClassement());
    this.nbClassement++;
  }
  deleteRowClassementForm(index: number) {
    this.formArrClassement.removeAt(index);
    this.nbClassement--;
  }

  itemChoiceOnClassement(): FormGroup {
    return this._fb.group({
      id: '',
      choice: ['', Validators.required]
    })
  }

  addItemOnClassementChoice(index: number) {
    this.addclassement.controls.itemRowsClassement['controls'][index].controls.itemClassementChoices.push(this.itemChoiceOnClassement());
  }

  removeItemOnClassementChoice(index: number) {
    if (this.addclassement.controls.itemRowsClassement['controls'][index].controls.itemClassementChoices.length > 1) {
      this.addclassement.controls.itemRowsClassement['controls'][index].controls.itemClassementChoices.removeAt(this.addclassement.controls.itemRowsClassement['controls'][index].controls.itemClassementChoices.length - 1)
    }
  }
  // Rédaction

  public addredaction: FormGroup;

  get formArrRedaction() {
    return this.addredaction.get('itemRowsRedaction') as FormArray;
  }

  initItemRowsRedaction() {
    return this._fb.group({
      questionTypeId: ['4'],
      question_name: ['', Validators.required],
      texte: [''],
      itemRedactionChoices: this._fb.array([this.itemChoiceOnRedaction()]),
      timing: ['', Validators.required],
      unit: ['mn', Validators.required],
      //point: [''],
    });
  }
  addRedactionForm() {
    this.formArrRedaction.push(this.initItemRowsRedaction());
    this.nbRedaction++;
  }
  deleteRowRedactionForm(index: number) {
    this.formArrRedaction.removeAt(index);
    this.nbRedaction--;
  }
  itemChoiceOnRedaction(): FormGroup {
    return this._fb.group({
      id: '',
      choice: ['', Validators.required],
      response: ['', Validators.required],
    })
  }

  addItemOnRedactionChoice(index: number) {
    this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.push(this.itemChoiceOnRedaction());
  }

  removeItemOnRedactionChoice(index: number) {
    if (this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.length > 1) {
      console.log(`longueur ${this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.length}`);
      this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.removeAt(this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.length - 1)
    }
  }
  // Audio

  public addaudio: FormGroup;

  get formArrAudio() {
    return this.addaudio.get('itemRowsAudio') as FormArray;
  }

  initItemRowsAudio() {
    return this._fb.group({
      questionTypeId: ['5'],
      question_name: ['', Validators.required],
      audioRep: ['1'],
      audio: [''],
      itemAudioChoices: this._fb.array([this.itemChoiceOnAudio()]),
      timing: ['', Validators.required],
      unit: ['mn', Validators.required],
      //point: [''],
    });
  }
  addAudioForm() {
    this.formArrAudio.push(this.initItemRowsAudio());
    this.nbAudio++;
  }
  deleteRowAudioForm(index: number) {
    this.formArrAudio.removeAt(index);
    this.nbAudio--;
  }

  itemChoiceOnAudio(): FormGroup {
    return this._fb.group({
      id: '',
      choice: ['', Validators.required],
      response: ['', Validators.required],
    })
  }

  addItemOnAudioChoice(index: number) {
    this.addaudio.controls.itemRowsAudio['controls'][index].controls.itemAudioChoices.push(this.itemChoiceOnAudio());
  }

  removeItemOnAudioChoice(index: number) {
    if (this.addaudio.controls.itemRowsAudio['controls'][index].controls.itemAudioChoices.length > 1) {
      this.addaudio.controls.itemRowsAudio['controls'][index].controls.itemAudioChoices.removeAt(this.addaudio.controls.itemRowsAudio['controls'][index].controls.itemAudioChoices.length - 1)
    }
  }
  // tslint:disable-next-line: typedef
  onSelectedAudio(fileInput: any) {
    if (fileInput !== null) {
      const file: File = fileInput.target.files[0];
      console.log(fileInput.target.style.display);
      //this.formData.append('audio', file, file.name);
      console.log(this.addaudio.value.itemRowsAudio);
    }
  }

  public addvideo: FormGroup;

  get formArrVideo() {
    return this.addvideo.get('itemRowsVideo') as FormArray;
  }

  initItemRowsVideo() {
    return this._fb.group({
      questionTypeId: ['6'],
      question_name: ['', Validators.required],
      videoRep: ['1'],
      itemVideoChoices: this._fb.array([this.itemChoiceOnVideo()]),
      video: [''],
      timing: ['', Validators.required],
      unit: ['mn', Validators.required],
      //point: [''],
    });
  }
  addVideoForm() {
    this.formArrVideo.push(this.initItemRowsVideo());
    this.nbVideo++;
  }
  deleteRowVideoForm(index: number) {
    this.formArrVideo.removeAt(index);
    this.nbVideo--;
  }

  itemChoiceOnVideo(): FormGroup {
    return this._fb.group({
      id: '',
      choice: ['', Validators.required],
      response: ['', Validators.required],
    })
  }

  addItemOnVideoChoice(index: number) {
    this.addvideo.controls.itemRowsVideo['controls'][index].controls.itemVideoChoices.push(this.itemChoiceOnVideo());
  }

  removeItemOnVideoChoice(index: number) {
    if (this.addvideo.controls.itemRowsVideo['controls'][index].controls.itemVideoChoices.length > 1) {
      this.addvideo.controls.itemRowsVideo['controls'][index].controls.itemVideoChoices.removeAt(this.addvideo.controls.itemRowsVideo['controls'][index].controls.itemVideoChoices.length - 1)
    }
  }

  onSelectedVideo(fileInput: any) {
    if (fileInput !== null) {
      const file: File = fileInput.target.files[0];
      console.log(fileInput.target.style.display);
      //this.formData.append('audio', file, file.name);
      console.log(this.addvideo.value.itemRowsVideo);
    }
  }

  goTo(path) {
    this.router.navigateByUrl(path);
  }

  setFolder() {
    const folder = {
      offreId: this.addquestion.controls.offer.value,
      titre: this.addquestion.controls.name_dir.value,
      fiche: this.addquestion.controls.fiche_dir.value,
      auteur: this.addquestion.controls.author_dir.value,
      idUser: this.idUser
    }
    console.log(folder)
    this.offreService.setFolder(folder).subscribe((rsp: any) => {
      console.log(rsp)
      const updateOffre = {
        offreId: this.addquestion.controls.offer.value,
        dossier: true,
      }
      this.offreService.setFolderOffer(updateOffre).subscribe((data: any) => {
        if (data.error === false) {
          this.toastr.success('Votre dossier a été bien créé', '', {
            timeOut: 2000
          });
          this.showQuest = !this.showQuest;
        } else {
          this.toastr.error('Une erreur est survenue', '', {
            timeOut: 2000
          });
        }
      })
    })
  }

  save() {
    this.questions = [
      this.addtruefalse.value.itemRowsTrueFalse,
      this.addmultiplechoise.value.itemRowsMultipleChoise,
      this.addclassement.value.itemRowsClassement,
      this.addredaction.value.itemRowsRedaction,
      this.addaudio.value.itemRowsAudio,
      this.addvideo.value.itemRowsVideo,
    ];

    const test = {
      offer: this.addquestion.controls.offer.value,
      // name: this.addquestion.controls.name_dir.value,
      // fiche_dir: this.addquestion.controls.fiche_dir.value,
      // author_dir: this.addquestion.controls.author_dir.value,
      /* 	userId: this.user.userId, */
    };

    let questionTrueOrFalses = [];
    let criteriaTrueFalses = [];
    for (let i = 0; i < this.nbTrueFalse; i++) {
      let criteriaTrueFalse = new CriteriaPointQuestion({
        id: this.addtruefalse.value.itemRowsTrueFalse[i].critereId,
        wording: "Total",
        point: this.addtruefalse.value.itemRowsTrueFalse[i].point,
        quizId: this.idQuiz,
        questionId: this.addtruefalse.value.itemRowsTrueFalse[i].id
      });
      console.log(criteriaTrueFalse);
      // console.log(this.addtruefalse.value.itemRowsTrueFalse)
      const data_responses = {
        id: [this.addtruefalse.value.itemRowsTrueFalse[i].idRep1],
        isAnswers: [this.addtruefalse.value.itemRowsTrueFalse[i].rep1]
      };
      let questionTrueFalse = {
        id: this.addtruefalse.value.itemRowsTrueFalse[i].id,
        name: this.addtruefalse.value.itemRowsTrueFalse[i].question_name,
        type: 1,
        offreId: this.addquestion.controls.offer.value,
        quizId: this.idQuiz,
        point: this.addtruefalse.value.itemRowsTrueFalse[i].point,
        timing: this.addtruefalse.value.itemRowsTrueFalse[i].timing + this.addtruefalse.value.itemRowsTrueFalse[i].unit,
        criteres: [criteriaTrueFalse],
        responses: data_responses
      };
      criteriaTrueFalses.push(new CriteriaPointQuestion(criteriaTrueFalse));
      questionTrueOrFalses.push(new Question(questionTrueFalse));
    }

    let questionMultiples = [];
    for (let i = 0; i < this.nbMultipleChoise; i++) {
      let criteriaMultipleChoice = new CriteriaPointQuestion({
        id: this.addmultiplechoise.value.itemRowsMultipleChoise[i].critereId,
        wording: "Total",
        point: this.addmultiplechoise.value.itemRowsMultipleChoise[i].point,
        quizId: this.idQuiz,
        questionId: this.addmultiplechoise.value.itemRowsMultipleChoise[i].id
      });
      let all_ids = [];
      let all_choices = [];
      let all_isAnswers = [];
      // console.log(this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][i].controls.itemMultipleChoices);
      for (let index = 0; index < this.addmultiplechoise.value.itemRowsMultipleChoise[i].itemMultipleChoices.length; index++) {
        all_ids.push(this.addmultiplechoise.value.itemRowsMultipleChoise[i].itemMultipleChoices[index].id);
        all_choices.push(this.addmultiplechoise.value.itemRowsMultipleChoise[i].itemMultipleChoices[index].choice);
        all_isAnswers.push(this.addmultiplechoise.value.itemRowsMultipleChoise[i].itemMultipleChoices[index].isResponse);
      }
      const data_responses = {
        id: all_ids,
        choices: all_choices,
        isAnswers: all_isAnswers,
        questionId: this.addmultiplechoise.value.itemRowsMultipleChoise[i].id
      };
      // console.log(data_responses);
      const questionMultiple = new Question({
        id: this.addmultiplechoise.value.itemRowsMultipleChoise[i].id,
        name: this.addmultiplechoise.value.itemRowsMultipleChoise[i].question_name,
        type: 2,
        quizId: this.idQuiz,
        offreId: this.addquestion.controls.offer.value,
        point: this.addmultiplechoise.value.itemRowsMultipleChoise[i].point,
        timing: this.addmultiplechoise.value.itemRowsMultipleChoise[i].timing + this.addmultiplechoise.value.itemRowsMultipleChoise[i].unit,
        criteres: [criteriaMultipleChoice],
        responses: new ResponseQuizz(data_responses)
      });
      questionMultiples.push(questionMultiple);
    }
    let questionClassements = [];
    for (let i = 0; i < this.nbClassement; i++) {
      let criteriaquestionClassement = new CriteriaPointQuestion({
        id: this.addclassement.value.itemRowsClassement[i].critereId,
        wording: "Partiel",
        point: this.addclassement.value.itemRowsClassement[i].point,
        questionId: this.addclassement.value.itemRowsClassement[i].id
      });
      let all_ids = [];
      let all_choices = [];
      let all_isAnswers = [];
      // console.log(this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][i].controls.itemClassementChoices);
      for (let index = 0; index < this.addclassement.value.itemRowsClassement[i].itemClassementChoices.length; index++) {
        all_ids.push(this.addclassement.value.itemRowsClassement[i].itemClassementChoices[index].id);
        all_choices.push(this.addclassement.value.itemRowsClassement[i].itemClassementChoices[index].choice);
        all_isAnswers.push(this.addclassement.value.itemRowsClassement[i].itemClassementChoices[index].isResponse);
      }

      const rang = [1, 2, 3, 4];
      const data_responses = {
        id: all_ids,
        choices: all_choices,
        rang: rang,
        questionId: this.addclassement.value.itemRowsClassement[i].id
      };
      const questionClassement = new Question({
        id: this.addclassement.value.itemRowsClassement[i].id,
        name: this.addclassement.value.itemRowsClassement[i].question_name,
        type: 3,
        quizId: this.idQuiz,
        offreId: this.addquestion.controls.offer.value,
        point: this.addclassement.value.itemRowsClassement[i].point,
        timing: this.addclassement.value.itemRowsClassement[i].timing + this.addclassement.value.itemRowsClassement[i].unit,
        criteres: [criteriaquestionClassement],
        responses: new ResponseQuizz(data_responses)
      });
      questionClassements.push(questionClassement);
    }
    // alert(`QUESTION CLASSEMENTS ${JSON.stringify(questionClassements)}`);

    let questionRedactions = [];
    for (let i = 0; i < this.nbRedaction; i++) {
      let criteriaquestionRedactions = [];
      for (let index = 0; index < this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices.length; index++) {
        criteriaquestionRedactions.push(new CriteriaPointQuestion({
          id: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].id,
          wording: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].choice,
          point: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].response,
          quizId: this.idQuiz,
          questionId: this.addredaction.value.itemRowsRedaction[i].id
        }));
      }

      let all_choices = [this.addredaction.value.itemRowsRedaction[i].texte];
      let all_ids = [this.addredaction.value.itemRowsRedaction[i].responseId];
      let data_responses = {
        id: all_ids,
        choices: all_choices,
        questionId: this.addredaction.value.itemRowsRedaction[i].id
      };
      const questionRedaction = new Question({
        id: this.addredaction.value.itemRowsRedaction[i].id,
        name: this.addredaction.value.itemRowsRedaction[i].question_name,
        type: 4,
        quizId: this.idQuiz,
        offreId: this.addquestion.controls.offer.value,
        point: this.addredaction.value.itemRowsRedaction[i].point,
        timing: this.addredaction.value.itemRowsRedaction[i].timing + this.addredaction.value.itemRowsRedaction[i].unit,
        criteres: criteriaquestionRedactions,
        responses: new ResponseQuizz(data_responses)
      });
      questionRedactions.push(questionRedaction);
    }

    let questionAudios = [];
    for (let i = 0; i < this.nbAudio; i++) {
      let criteriaquestionAudios = [];
      for (let index = 0; index < this.addaudio.value.itemRowsAudio[i].itemAudioChoices.length; index++) {
        criteriaquestionAudios.push(new CriteriaPointQuestion({
          id: this.addaudio.value.itemRowsAudio[i].itemAudioChoices[index].id,
          wording: this.addaudio.value.itemRowsAudio[i].itemAudioChoices[index].choice,
          point: this.addaudio.value.itemRowsAudio[i].itemAudioChoices[index].response,
          quizId: this.idQuiz,
          questionId: this.addaudio.value.itemRowsAudio[i].id
        }));
      }
      let all_ids = [this.addaudio.value.itemRowsAudio[i].responseId];
      const data_responses = {
        id: all_ids,
        type_audio: this.addaudio.value.itemRowsAudio[i].audioRep,
        questionId: this.addaudio.value.itemRowsAudio[i].id
      };
      const questionAudio = new Question({
        id: this.addaudio.value.itemRowsAudio[i].id,
        name: this.addaudio.value.itemRowsAudio[i].question_name,
        type: 5,
        quizId: this.idQuiz,
        offreId: this.addquestion.controls.offer.value,
        point: this.addaudio.value.itemRowsAudio[i].point,
        timing: this.addaudio.value.itemRowsAudio[i].timing + this.addaudio.value.itemRowsAudio[i].unit,
        criteres: criteriaquestionAudios,
        responses: new ResponseQuizz(data_responses)
      });
      questionAudios.push(questionAudio);

    }

    let questionVideos = [];
    for (let i = 0; i < this.nbVideo; i++) {
      let criteriaquestionVideos = [];
      for (let index = 0; index < this.addvideo.value.itemRowsVideo[i].itemVideoChoices.length; index++) {
        criteriaquestionVideos.push(new CriteriaPointQuestion({
          id: this.addvideo.value.itemRowsVideo[i].itemVideoChoices[index].id,
          wording: this.addvideo.value.itemRowsVideo[i].itemVideoChoices[index].choice,
          point: this.addvideo.value.itemRowsVideo[i].itemVideoChoices[index].response,
          quizId: this.idQuiz,
          questionId: this.addvideo.value.itemRowsVideo[i].id
        }));
      }

      let all_ids = [this.addvideo.value.itemRowsVideo[i].responseId];
      const data_responses = {
        id: all_ids,
        type_audio: this.addvideo.value.itemRowsVideo[i].videoRep,
        questionId: this.addvideo.value.itemRowsVideo[i].id
      };
      const questionVideo = new Question({
        id: this.addvideo.value.itemRowsVideo[i].id,
        name: this.addvideo.value.itemRowsVideo[i].question_name,
        type: 6,
        quizId: this.idQuiz,
        offreId: this.addquestion.controls.offer.value,
        point: this.addvideo.value.itemRowsVideo[i].point,
        timing: this.addvideo.value.itemRowsVideo[i].timing + this.addvideo.value.itemRowsVideo[i].unit,
        criteres: criteriaquestionVideos,
        responses: new ResponseQuizz(data_responses)
      });
      questionVideos.push(questionVideo);

    }

    let test_to_create = {
      ...test,
      ...{ listIds: this.ids }, ...{ listTrueOrFalse: questionTrueOrFalses }, ...{ listMultiple: questionMultiples }, ...{ listRedaction: questionRedactions }, ...{ listClassement: questionClassements }, ...{ listAudio: questionAudios }, ...{ listVideo: questionVideos }
    }
    // console.log(JSON.stringify(test_to_create));
    this.quizS.updateQuizContent(this.idQuiz, test_to_create).subscribe(response => {
      this.toastr.success('Projet enregistré ' + this.quizName, '', {
        timeOut: 2000
      });
      this.goTo(`/projet`);
    })
  }

  preValidate() {
    if (this.offreId && this.questions.length > 0) {
      this.quizS.updateQuizStatePublished(this.idQuiz, { publier: true }).subscribe(response => {
        if (!response.error) {
          // update offre
          console.log(response);
          this.offreService.setFolderOffer({ offreId: this.offreId, dossier: true }).subscribe(folder_response => {
            console.log(folder_response);
          })
          this.offreService.updatePublier({ publier: true }, this.offreId).subscribe(response_update_offre => {
            console.log(response_update_offre.message);
          })
          this.toastr.success(`le projet  ${this.quizName} a été publié`, '', {
            timeOut: 2000
          });
          this.goTo(`/projet`);
        } else {
          this.toastr.error(`il y a un erreur lors de la publication de ce quiz`, '', {
            timeOut: 2000
          });
        }
      })
      // update publier
    }
    else {
      this.toastr.error(`le nombre de question dans le projet ${this.quizName} doit être supérieur à 0 et doit être associé à un offre`, '', {
        timeOut: 2000
      });
    }
  }
}
