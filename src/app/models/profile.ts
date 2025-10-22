export class Profile {
  id: number;
  firstName: string;
  lastName: string;
  ville: string;
  pays: string;
  numTel: string;
  email: string;
  metierActuel: string;
  anneesExperiences: string;
  niveauEtudes: string;
  diplomes: string;
  specialisations: string;

  constructor(data: any) {
    data = data || {};

    this.id = data.id || null;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.ville = data.ville;
    this.pays = data.pays;
    this.numTel = data.numTel;
    this.metierActuel = data.metierActuel;
    this.anneesExperiences = data.anneesExperiences;
    this.niveauEtudes = data.niveauEtudes;
    this.diplomes = data.diplomes;
    this.specialisations = data.specialisations;
  }

  public getData() {
    alert(` \nNom ${this.lastName}\n 
    Prénom ${this.firstName}\n
    Ville ${this.ville}\n
    Pays ${this.pays}\n
    Indicatifs Pays ${this.numTel}\n
    Métier actuel ${this.metierActuel}\n
    Années d'expérience ${this.anneesExperiences}\n
    Niveau d'étude ${this.niveauEtudes}\n
    diplomes ${this.diplomes}\n
    spécialisation de diplome ${this.specialisations}\n
    `);
  }
}
