import { IClientRepository } from '../../repositories/IClientRepository';
import { IRefreshTokenRepository } from '../../repositories/IRefreshTokenRepository';
import { IDateProvider } from '../../../../shared/providers/Date/IDateProvider';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { AUTH } from '../../../../config/auth';

interface IRequest {

  client: {
    name: string,
    email: string,
    id: string
  },
  token: string
}

export class TokenService {

  constructor(
    private clientRepository: IClientRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private dateProvider: IDateProvider
  ) { }

  async execute(
    email: string,
    password: string
  ): Promise<IRequest> {

    const ensureClientEmailAlreadyExists = await this
      .clientRepository
      .findByEmail(email);

    if (!ensureClientEmailAlreadyExists) {

      throw new Error("Email or Password are incorrect!");
    }

    const ensureClientPasswordCompare = compare(
      ensureClientEmailAlreadyExists.props.password,
      password
    );

    if (!ensureClientPasswordCompare) {

      throw new Error("Email or Password are incorrect!");
    }

    const {
      AUTH_TOKEN_EXPIRES_IN,
      AUTH_TOKEN_SECRET_KEY,
      REFRESH_TOKEN_EXPIRES_IN_DAYS,
      REFRESH_TOKEN_EXPIRES_IN,
      REFRESH_TOKEN_SECRET_KEY
    } = AUTH;

    const token = sign(
      {},
      AUTH_TOKEN_SECRET_KEY, {
      expiresIn: AUTH_TOKEN_EXPIRES_IN,
      subject: ensureClientEmailAlreadyExists.id
    });

    const refresh_token = sign({ email },
      REFRESH_TOKEN_SECRET_KEY,
      {
        subject: ensureClientEmailAlreadyExists.id,
        expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`
      });

    const refreshTokenExpiresInDate: Date = await this
      .dateProvider
      .addDays(REFRESH_TOKEN_EXPIRES_IN);

    await this.refreshTokenRepository.create({
      JWT_token: token,
      refresh_token: refresh_token,
      expires_in: refreshTokenExpiresInDate,
      user_id: ensureClientEmailAlreadyExists.id
    })

    const response: IRequest = {
      client: {
        name: ensureClientEmailAlreadyExists.props.name,
        email: ensureClientEmailAlreadyExists.props.email,
        id: ensureClientEmailAlreadyExists.id
      },
      token: token
    }

    return response;
  }
}