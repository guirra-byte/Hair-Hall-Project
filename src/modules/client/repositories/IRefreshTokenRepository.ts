import { IRefreshTokenDTO } from "../dtos/IRefreshTokenDTO";
import { RefreshToken } from "../model/RefreshToken";

export interface IRefreshTokenRepository {
  create({ JWT_token, refresh_token, expires_in, user_id }: IRefreshTokenDTO): Promise<void>
  ensureRefreshToken(refresh_token: string): Promise<RefreshToken | undefined>
}