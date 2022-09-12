import { IDateProvider } from "../../../shared/providers/Date/IDateProvider";
import { IClientRepository } from "../repositories/IClientRepository";
import { IRefreshTokenRepository } from "../repositories/IRefreshTokenRepository";
import { AppError } from "../../../shared/infra/errors/AppError";

import { hash } from 'bcryptjs';
import {
  v4 as uuidV4,
  validate,
  version,
  parse
} from 'uuid';

enum HASH_VALIDATE_TIME {
  EXPIRES_IN = 15
};

export interface IResponse {
  message: string;
  hash_token: string
}

export class ForgotClientAccountPasswordService {
  constructor(
    private clientRepository: IClientRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private dateProvider: IDateProvider) { }
  async execute(
    refresh_token: string,
    email: string
  ): Promise<IResponse> {

    const ensureUserExists = await this
      .clientRepository
      .findByEmail(email);

    if (!ensureUserExists) {
      throw new AppError(
        'Does not exists this User Email',
        400,
        'forgot_client_account_password_service'
      );
    }

    const ensureRefreshTokenAreValid = await this
      .refreshTokenRepository
      .ensureRefreshToken(refresh_token);

    if (!ensureRefreshTokenAreValid) {
      throw new AppError(
        'Refresh Token are invalid!',
        400,
        'forgot_client_account_password_service'
      );
    }

    const lastRequest = ensureUserExists
      .props
      .lastForgotPasswordRequest;

    const dateNow = await this.dateProvider.dateNow();
    ensureUserExists.props.lastForgotPasswordRequest = dateNow;

    const now = await this
      .dateProvider
      .dateNow();

    const compareLastForgotPasswordRequest: boolean = await this
      .dateProvider
      .compareIfBefore(now, lastRequest);

    if (compareLastForgotPasswordRequest === false) {

      const hash: string = uuidV4();
      const breakHash = hash.split('-');

      const hashIndex: number = 0;
      const hashTokenKey = breakHash[hashIndex];

      await this.clientRepository
        .saveHashToken(hashTokenKey);

      [...breakHash].splice(hashIndex);

      for (
        let index = 0;
        index <= breakHash.length;
        index++
      ) {

        const remainderHash = breakHash[index] !== hashTokenKey
          ? [...breakHash]
          : breakHash.splice(index);

        const insertHashTokenExpiresIn = async (
          hash_token_key: string,
          remainder_hash_token: string[] | string,
          expires_in: number
        ) => {

          const handleRemainderHashToken: string = `${remainder_hash_token[index === 0 ? index : 0]}
          -${remainder_hash_token[index === 1 ? index : 1]}
          -${remainder_hash_token[index === 2 ? index : 2]}
          -${remainder_hash_token[index === 3 ? index : 3]}`;

          const ensureHashTokenAreValid = validate(`${hash_token_key}-${handleRemainderHashToken}`);

          if (ensureHashTokenAreValid) {
            const addMinutes = await this
              .dateProvider
              .addMinutes(expires_in);

            await this
              .clientRepository
              .updateHashExpiresIn(ensureHashTokenAreValid, addMinutes);

            //[] - Enviar o Email de reset de forgotPassword
            //[] - Com o Hash Token no Content do Email;
          }

          throw new AppError('Hash Token are invalid');
        }

        const { EXPIRES_IN } = HASH_VALIDATE_TIME;
        insertHashTokenExpiresIn(hashTokenKey, remainderHash, EXPIRES_IN);

        const response: IResponse = {
          message: `Você possui acesso ao token por ${EXPIRES_IN} minutos`,
          hash_token: hashTokenKey
        }
        return response;
      }
    } if (compareLastForgotPasswordRequest === true) {
      const compareInMinutes = await this
        .dateProvider
        .compareInMinutes(now, lastForgotPasswordRequest);

      if (compareInMinutes < HASH_VALIDATE_TIME.EXPIRES_IN) {
        throw new AppError('User already have a valid Hash Token!');
      }
      else {
        throw new AppError('Unexpected Error!');
      }
    }
  }
  async handleExecute(
    refresh_token: string,
    hashTokenKey: string,
    new_password: string
  ): Promise<void> {

    const ensureRefreshTokenAreValid = await this
      .refreshTokenRepository
      .compareToken(refresh_token);

    if (!ensureRefreshTokenAreValid) {
      throw new AppError('Refresh Token are invalid!');
    }

    const { user_id } = ensureRefreshTokenAreValid;

    const getRemainderHash = await this
      .clientRepository
      .getLastRemainderHash(user_id);

    const { remainderHash, expires_in } = getRemainderHash;
    const ensureCompleteHashToken: boolean = validate(`${hashTokenKey}-${remainderHash}`);

    if (!ensureCompleteHashToken) {
      throw new AppError('Hash Token Key are invalid!');
    }

    const now = await this.dateProvider.dateNow();
    const ensureHashTokenAlreadyIsValid: boolean = await this
      .dateProvider
      .compareIfBefore(now, expires_in);

    if (!ensureHashTokenAlreadyIsValid) {
      throw new AppError('Hash Token as expired!');
    }

    const hashThePassword = await hash(new_password, 10);

    await this
      .clientRepository
      .updateUserPassword(hashThePassword);

    //[] - Realizar o envio de Email de confirmação de alteração de Password;
    //[] - Realizar a remoção do Hash Token Key e Remainder Hash Token;
    //[] - Realizar o Update na data para ser possível realizar um novo reset de Password;
    //[] - Realizar contagem de resets de passwords por dia;
    //[] - Se o User tentar realizar mais resets do que o permitido sua sessão é expirada;
  }

}