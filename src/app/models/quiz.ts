import { QuizConfig } from './quiz-config';
import { Question } from './question';
import { Offres } from './offres';

export class Quiz {
    id: number;
    name: string;
    description: string;
    config: QuizConfig;
    questions: Question[];
    datePublication: Date;
    offre: Offres;
    updatedAt: Date;

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.fiche_dir;
            this.config = new QuizConfig(data.config);
            this.questions = [];
            this.datePublication = new Date(data.date_publication);
            this.offre = new Offres(data?.offre || data.offerInQuiz && data.offerInQuiz[0]);
            this.updatedAt = new Date(data.updatedAt);
            // alert(JSON.stringify(data));
            data?.questions && data?.questions.forEach(question => {
                let q = {
                    id: question.id,
                    name: question.enunciate,
                    timing: question.timer,
                    offerId: question.offerId,
                    TypeQuestionId: question.TypeQuestionId,
                    options: question.options,
                    criteres: question.criteria_point_questions
                }
                this.questions.push(new Question(q));
            });
        }
    }

    getClassicDate(dateN: Date) {
        let date = ("0" + dateN.getDate()).slice(-2);

        // current month
        let month = ("0" + (dateN.getMonth() + 1)).slice(-2);

        // current year
        let year = dateN.getFullYear();

        // prints date in YYYY-MM-DD format
        return year + "-" + month + "-" + date;
    }
}
