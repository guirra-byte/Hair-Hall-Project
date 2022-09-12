import { v4 as uuidV4 } from 'uuid';

export class RefreshToken {

  id: string;
  refresh_token: string;
  JWT_token: string;
  expires_in: Date;
  user_id: string;

  constructor(JWT_token: string, refresh_token: string, expires_in: Date, user_id: string, id?: string) {
    this.JWT_token = JWT_token;
    this.refresh_token = refresh_token;
    this.expires_in = expires_in;
    this.user_id = user_id;
    this.id = id === undefined ? uuidV4() : id;
  }
}