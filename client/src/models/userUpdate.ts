export interface UpdateUser {
  userName: string;
  email: string;
  password?: string;
  currentPassword?: string;
  Token: string;
}
