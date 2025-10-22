import { CriteriaPointQuestion } from './criteria-point-question';
import { Option } from './option';
import { ResponseQuizz } from './response-quizz';

export class Question {
    id: number;
    enunciate: string;
    TypeQuestionId: number;
    quizId: number;
    offreId: number;
    options: Option[];
    timer: string;
    responses: ResponseQuizz;
    criteres: any[];
    answered: string;
    point: number;

    constructor(data: any) {
        if (data) {
            this.criteres = [];
            data = data || {};
            this.id = data.id || null;
            this.enunciate = data.name;
            this.TypeQuestionId = data.type || data.TypeQuestionId;
            this.quizId = data.quizId || null;
            this.offreId = data.offreId || null;
            this.timer = data.timing;
            this.responses = data.responses;
            this.point = data.point;

            this.options = [];
            data.options && data.options.forEach(option => {
                this.options.push(new Option({
                    id: option.id,
                    name: option.choices,
                    questionId: option.questionId,
                    isAnswer: option.isAnswers,
                    rang: option.rang,
                    typeAudio: option.type_audio
                }))
                // option.choices && this.responses.choices.push(option.choices);
                // option.choices && this.responses.isAnswers.push(option.isAnswers);
            });
            data.criteres && data.criteres.forEach(response => {
                this.criteres.push(new CriteriaPointQuestion(response));
            });
        }
    }

    addCriteres(critere: any) {
        this.criteres.push(critere);
    }

    setCriteres(criteres: any[]) {
        this.criteres = criteres;
    }

    setEnunciate(enunciate: string) {
        this.enunciate = enunciate;
    }

    setTimer(timing: string) {
        this.timer = timing;
    }

    setReponse(data: any) {
        this.responses = data;
    }

    setOffreId(offreId: number) {
        this.offreId = offreId;
    }
}
