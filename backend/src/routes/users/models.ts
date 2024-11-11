export interface User {
  username: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}