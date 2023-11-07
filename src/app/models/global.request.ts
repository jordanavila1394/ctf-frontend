export class LoginRequest {
  public username: string;
  public password: string;

  constructor (username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class RegisterRequest {
  public username: string;
  public email: string;
  public password: string;

  constructor (username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}




