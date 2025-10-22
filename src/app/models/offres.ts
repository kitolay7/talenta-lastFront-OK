
export class Offres {
    id: number;
    titre: string;
    description: string;
    contexte: string;
    missions: string;
    qualification: string;
    logo: string;
    video: string;
    messages: string;
    photoAnime: string;
    pays: string;
    publier: boolean;
    postuled: boolean;
    offer_postuled: any[];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.titre = data.titre;
            this.description = data.description;
            this.contexte = data.contexte;
            this.missions = data.missions;
            this.qualification = data.qualification;
            this.logo = data.logo;
            this.video = data.video;
            this.messages = data.messages;
            this.photoAnime = data.photoAnime;
            this.pays = data.pays;
            this.publier = data.publier;
            this.postuled = data.postuled;
        }
    }
}
