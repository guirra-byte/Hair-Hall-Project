export interface IRefreshTokenDTO {
  JWT_token: string;
  refresh_token: string;
  expires_in: Date;
  user_id: string;
}