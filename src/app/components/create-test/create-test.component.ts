import { Component, OnInit } from '@angular/core';
import { Option, Question, Quiz, QuizConfig, CriteriaPointQuestion } from '../../models';
import { VraiFaux } from '../../models/create-test-form/vrai-faux';
import { QCM } from '../../models/create-test-form/qcm';
import { Classement } from '../../models/create-test-form/classement';
import { Redaction } from '../../models/create-test-form/redaction';
import { Audio } from '../../models/create-test-form/audio';
import { Video } from '../../models/create-test-form/video';
import { DataService } from 'src/app/services/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OffreService } from '../../services/offre.service';
import { TestService } from '../../services/test.service';
import { UserService } from 'src/app/services/user.service';
import { Offres } from '../../models/offres';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecordComponent } from '../record/record.component';
import { ResponseQuizz } from 'src/app/models/response-quizz';
import { BehaviorSubject } from 'rxjs';
import { AdminFeatureService, QuizMode } from 'src/app/services/admin-feature.service';


@Component({
	selector: 'app-create-test',
	templateUrl: './create-test.component.html',
	styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {
	title = "AU CŒUR D’UN RECRUTEMENT DE QUALITE";
	mode: QuizMode = 'all';
	offres: Offres[] = [];
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
	offre: any;
	user = [];
	questions = [];
	nbTrueFalse = 0;
	nbMultipleChoise = 0;
	nbClassement = 0;
	nbRedaction = 0;
	nbAudio = 0;
	nbVideo = 0;
	allReponse = [];
	idDescr = 0;
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

	currentUserSubject: BehaviorSubject<any>;
	currentSection: any;
	idFolder: number;
	idUser: any;
	showQuest: boolean;
	message: string;
	constructor(
		private _fb: FormBuilder,
		private offreService: OffreService,
		private testService: TestService,
		private userServ: UserService,
		private toastr: ToastrService,
		private router: Router,
		private feature: AdminFeatureService

	) {
		this.isLoading = true;
		this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('idUser'));
		if (this.currentUserSubject.getValue() !== null) {
			const a = JSON.parse(localStorage.getItem('idUser'));
			this.userServ.setUser(a);
			this.idUser = a;
			this.offreService.geteOfferByUser(this.idUser).subscribe(data => {
				// alert(JSON.stringify(data));
				if (data.length > 0) {
					this.offres = data;
				} else {
					this.message = 'Vous devriez ajouter des offres pour pouvoir acceder ce menu';
				}
			}
			)
		}
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
		// this.showQuest = false;
		this.feature.ensureLoaded();
		this.feature.mode$.subscribe(m => this.mode = m);
		this.allReponse.push({ id: 0, reponse: '', isReponse: false })
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

		this.isLoading = false;
	}

	// True or False

	public addtruefalse: FormGroup;

	// Helpers utilisés dans le template
	get allowNonAV(): boolean { return this.mode === 'all'; }
	get allowAV(): boolean { return this.mode === 'all' || this.mode === 'av'; }
	get allDisabled(): boolean { return this.mode === 'none'; }


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
			questionTypeId: ['1'],
			question_name: ['', Validators.required],
			rep1: ['', Validators.required],
			timing: ['', Validators.required],
			unit: ['s', Validators.required],
			point: ['', Validators.required],
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
	itemChoiceOnMultiple(): FormGroup {
		return this._fb.group({
			id: '',
			choice: ['', Validators.required],
			isResponse: false
		})
	}

	addItemOnMultipleChoice(index: number) {
		this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.push(this.itemChoiceOnMultiple());
	}

	removeItemOnMultipleChoice(index: number) {
		if (this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.length > 1) {
			this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.removeAt(this.addmultiplechoise.controls.itemRowsMultipleChoise['controls'][index].controls.itemMultipleChoices.length - 1);
		}
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
		console.log(this.addclassement.controls.itemRowsClassement);
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
			// console.log(`longueur ${this.addredaction.controls.itemRowsRedaction['controls'][index].controls.itemRedactionChoices.length}`);
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
			video: [''],
			itemVideoChoices: this._fb.array([this.itemChoiceOnVideo()]),
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
	// tslint:disable-next-line: typedef
	onSelectedVideo(fileInput: any) {
		if (fileInput !== null) {
			const file: File = fileInput.target.files[0];
			console.log(fileInput.target.style.display);
			//this.formData.append('audio', file, file.name);
			console.log(this.addvideo.value.itemRowsAudio);
		}
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


	scrollTo(section) {
		const el = document.querySelector('#' + section);
		const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
		window.scrollTo({ top: y, behavior: 'smooth' });
	}

	validationOK = false;
	isLoading = false;

	validate(publied) {
		this.isLoading = true;
		console.log(this.addmultiplechoise.value)
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
			name: this.addquestion.controls.name_dir.value,
			fiche_dir: this.addquestion.controls.fiche_dir.value,
			author_dir: this.addquestion.controls.author_dir.value,
			userId: this.idUser
		};
		// console.log(this.questions);
		let questionTrueOrFalses = [];
		let criteriaTrueFalses = [];
		for (let i = 0; i < this.nbTrueFalse; i++) {
			let criteriaTrueFalse = new CriteriaPointQuestion({
				wording: "Total",
				point: this.addtruefalse.value.itemRowsTrueFalse[i].point,
			});
			console.log(this.addtruefalse.value.itemRowsTrueFalse)
			const data_responses = {
				isAnswers: [this.addtruefalse.value.itemRowsTrueFalse[i].rep1]
			};
			let questionTrueFalse = {
				name: this.addtruefalse.value.itemRowsTrueFalse[i].question_name,
				type: 1,
				offreId: this.addquestion.controls.offer.value,
				point: this.addtruefalse.value.itemRowsTrueFalse[i].point,
				timing: this.addtruefalse.value.itemRowsTrueFalse[i].timing + this.addtruefalse.value.itemRowsTrueFalse[i].unit,
				criteres: [criteriaTrueFalse],
				responses: data_responses
			};
			criteriaTrueFalse.questionId = questionTrueFalse.offreId;
			criteriaTrueFalses.push(new CriteriaPointQuestion(criteriaTrueFalse));
			questionTrueOrFalses.push(new Question(questionTrueFalse));
		}

		let questionMultiples = [];
		for (let i = 0; i < this.nbMultipleChoise; i++) {
			let criteriaMultipleChoice = new CriteriaPointQuestion({
				id: this.addmultiplechoise.value.itemRowsMultipleChoise[i].critereId,
				wording: "Total",
				point: this.addmultiplechoise.value.itemRowsMultipleChoise[i].point,
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

			const data_responses = {
				id: all_ids,
				choices: all_choices,
				questionId: this.addclassement.value.itemRowsClassement[i].id
			};
			const questionClassement = new Question({
				id: this.addclassement.value.itemRowsClassement[i].id,
				name: this.addclassement.value.itemRowsClassement[i].question_name,
				type: 3,
				offreId: this.addquestion.controls.offer.value,
				point: this.addclassement.value.itemRowsClassement[i].point,
				timing: this.addclassement.value.itemRowsClassement[i].timing + this.addclassement.value.itemRowsClassement[i].unit,
				criteres: [criteriaquestionClassement],
				responses: new ResponseQuizz(data_responses)
			});
			questionClassements.push(questionClassement);
		}

		let questionRedactions = [];
		for (let i = 0; i < this.nbRedaction; i++) {
			let criteriaquestionRedactions = [];
			for (let index = 0; index < this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices.length; index++) {
				criteriaquestionRedactions.push(new CriteriaPointQuestion({
					id: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].id,
					wording: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].choice,
					point: this.addredaction.value.itemRowsRedaction[i].itemRedactionChoices[index].response,
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
				offreId: this.addquestion.controls.offer.value,
				point: this.addvideo.value.itemRowsVideo[i].point,
				timing: this.addvideo.value.itemRowsVideo[i].timing + this.addvideo.value.itemRowsVideo[i].unit,
				criteres: criteriaquestionVideos,
				responses: new ResponseQuizz(data_responses)
			});
			questionVideos.push(questionVideo);

		}

		let test_to_create = {
			...test, ...{ idUser: this.idUser }, ...{ publier: publied }, ...{ date_publication: (publied ? new Date() : null) }, ...{ idFolder: this.idFolder },
			...{ listTrueOrFalse: questionTrueOrFalses }, ...{ listMultiple: questionMultiples }, ...{ listRedaction: questionRedactions }, ...{ listClassement: questionClassements }, ...{ listAudio: questionAudios }, ...{ listVideo: questionVideos }
		}
		// alert(JSON.stringify(test_to_create));
		this.testService.createTest(test_to_create).subscribe((data: any) => {
			console.log(data);

			if (data.error === true) {
				this.isLoading = false;
				this.toastr.error('Une erreur est survenue', '', {
					timeOut: 2000
				});
			} else {
				if (publied) {
					this.offreService.updatePublier({ publier: true }, this.addquestion.controls.offer.value).subscribe((res: any) => {
						if (res.error === false) {
							this.isLoading = false;
							this.toastr.success('Votre test a été bien créé', '', {
								timeOut: 2000
							});
							this.goTo('/myaccount');
							console.log('dsdsqd')
						}
					})
				}
				// else {
				// 	this.isLoading = false;
				// 	this.toastr.success('Votre test a été enregistré', '', {
				// 		timeOut: 2000
				// 	});
				// 	const updateOffre = {
				// 		offreId: this.addquestion.controls.offer.value,
				// 		dossier: false,
				// 	}
				// this.offreService.setFolderOffer(updateOffre).subscribe((data: any) => {
				// 	if (data.error === false) {
				// 		// this.toastr.success('Votre dossier a été bien créé', '', {
				// 		// 	timeOut: 2000
				// 		// });
				// 	} else {
				// 		this.toastr.error('Une erreur est survenue', '', {
				// 			timeOut: 2000
				// 		});
				// 	}
				// })
				this.goTo('/projet');
				// }
			}
		})
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
		// console.log(folder)
		// this.offreService.setFolder(folder).subscribe((rsp: any) => {
		// 	console.log(rsp.data.id);
		// 	this.idFolder = rsp.data.id;
		// 	const updateOffre = {
		// 		offreId: this.addquestion.controls.offer.value,
		// 		dossier: true,
		// 	}
		// 	this.offreService.setFolderOffer(updateOffre).subscribe((data: any) => {
		// 		if (data.error === false) {
		// 			this.toastr.success('Votre dossier a été bien créé', '', {
		// 				timeOut: 2000
		// 			});
		// 		} else {
		// 			this.toastr.error('Une erreur est survenue', '', {
		// 				timeOut: 2000
		// 			});
		// 		}
		// 	})
		// })
		this.showQuest = !this.showQuest;
	}


}
