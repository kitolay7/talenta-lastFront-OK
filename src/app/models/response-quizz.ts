export class ResponseQuizz {
  id: number[];
  choices: string[];
  isAnswers: Boolean[];
  questionId: number;
  type_audio: number;
  rang: number;
  responseRedaction: string;

  constructor(data: any) {
    this.id = [];
    this.questionId = null;
    this.choices = [];
    this.rang = null;
    data?.choices && data?.choices.forEach(choice => {
      if (choice !== (null || "")) this.choices.push((choice));
    });
    this.isAnswers = [];
    data?.isAnswers && data?.isAnswers.forEach(isAnswer => {
      if (isAnswer !== (null || "")) this.isAnswers.push(isAnswer);
    });
    this.type_audio = null;
    if (data) {
      this.id = data?.id || null;
      this.questionId = data?.questionId || null;
      this.choices = [];
      this.rang = data?.rang || null;
      data?.choices && data?.choices.forEach(choice => {
        if (choice !== (null || "")) this.choices.push((choice));
      });
      this.isAnswers = [];
      data?.isAnswers && data?.isAnswers.forEach(isAnswer => {
        if (isAnswer !== (null || "")) this.isAnswers.push(isAnswer);
      });
      this.type_audio = data?.type_audio || null;
    }
  }

  setChoices(choices: string[]) {
    this.choices = choices;
  }

  getChoices() {
    return this.choices;
  }

  addChoice(choice: string) {
    this.choices.push(choice);
  }

  setTypeAudioOrVideo(type: string) {
    this.type_audio = parseInt(type);
  }

  setIds(ids: number[]) {
    this.id = ids;
  }

  setResponseRedaction(response: string) {
    this.responseRedaction = response;
  }
}
