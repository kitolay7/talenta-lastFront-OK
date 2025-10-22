import { from } from 'rxjs';
export class CriteriaPointQuestion {
  id: number;
  wording: string;
  point: number;
  questionId: number;
  quizId: number;
  constructor(data: any) {
    data = data || {};
    this.id = data.id || null;
    this.wording = data.wording;
    this.point = data.point;
    this.questionId = data.questionId || null;
    this.quizId = data.quizId;

  }
}
