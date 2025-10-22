export class Option {
    id: number;
    questionId: number;
    name: string;
    isAnswer: boolean;
    selected: boolean;
    rang: number;
    typeAudio: number;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.questionId = data.questionId;
        this.name = data.name;
        this.isAnswer = data.isAnswer;
        this.rang = data.rang;
        this.typeAudio = data.type_audio;
    }

    setTypeAudio(type: number) {
        this.typeAudio = type;
    }
}

