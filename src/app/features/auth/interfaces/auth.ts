export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly token: string;
}
