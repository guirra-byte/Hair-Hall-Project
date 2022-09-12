import { IRefreshTokenDTO } from "../../dtos/IRefreshTokenDTO";
import { RefreshToken } from "../../model/RefreshToken";
import { IRefreshTokenRepository } from "../IRefreshTokenRepository";

export class RefreshTokenRepository implements IRefreshTokenRepository {

  private repository: RefreshToken[];

  constructor() {
    this.repository = [];
  }

  async create(
    {
      JWT_token,
      refresh_token,
      expires_in,
      user_id }: IRefreshTokenDTO
  ): Promise<void> {

    const refreshToken = new RefreshToken(
      JWT_token,
      refresh_token,
      expires_in,
      user_id
    );

    this.repository.push(refreshToken);
  }

  async ensureRefreshToken(refresh_token: string): Promise<RefreshToken | undefined> {
    const ensureRefreshTokenExists = this.repository
      .find(token => token.refresh_token === refresh_token);

    return ensureRefreshTokenExists !== undefined ? ensureRefreshTokenExists : undefined;
  }

  async removeRefreshToken(refresh_token_id: string): Promise<void> {
    const findRefreshTokenIndexById = this
      .repository
      .findIndex(refresh_token => refresh_token.id === refresh_token_id);

    this.repository.slice(findRefreshTokenIndexById, 1);
  }
}