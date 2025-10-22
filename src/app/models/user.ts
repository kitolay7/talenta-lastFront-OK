export class User {
  id: number;
  email: string;
  password: string;

  constructor(data: any) {
    data = data || {};
    this.id = data.id || null;
    this.email = data.email;
    this.password = data.password;
  }

  public getData() {
    alert(`${this.email}\n 
    Password ${this.password}\n
    `);
  }
}
