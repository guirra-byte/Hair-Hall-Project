import { IDateProvider } from "../../../shared/infra/providers/Date/IDateProvider";
import { IClientRepository } from "../repositories/IClientRepository";
import { IRefreshTokenRepository } from "../repositories/IRefreshTokenRepository";
import { AppError } from "../../../shared/infra/errors/AppError";

import { hash } from 'bcryptjs';
import {
  v4 as uuidV4,
  validate,
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
  ): Promise<void> {

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

    const { lastForgotPasswordRequest } = ensureUserExists.props;

    const dateNow = await this.dateProvider.dateNow();
    ensureUserExists.props.lastForgotPasswordRequest = dateNow;

    const now = await this
      .dateProvider
      .dateNow();

    const compareLastForgotPasswordRequest: boolean = await this
      .dateProvider
      .compareIfBefore(now, lastForgotPasswordRequest);

    if (compareLastForgotPasswordRequest === false) {

      const hash: string = uuidV4();
      const breakHash = hash.split('-');

      const hashIndex: number = 0;
      const hashTokenKey = breakHash[hashIndex];

      const { id } = ensureUserExists;
      await this.clientRepository
        .saveHashToken(id, hashTokenKey);

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
          expires_in: number,
          client_id: string
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
              .updateHashExpiresIn(client_id, addMinutes);

            //[] - Enviar o Email de reset de forgotPassword
            //[] - Com o Hash Token no Content do Email;
          }

          throw new AppError('Hash Token are invalid');
        }

        const { EXPIRES_IN } = HASH_VALIDATE_TIME;
        const { id } = ensureUserExists;
        insertHashTokenExpiresIn(hashTokenKey, remainderHash, EXPIRES_IN, id);
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
      .ensureRefreshToken(refresh_token);

    if (!ensureRefreshTokenAreValid) {
      throw new AppError('Refresh Token are invalid!');
    }

    const { user_id } = ensureRefreshTokenAreValid;

    const getRemainderHash = await this
      .clientRepository
      .findRemainderHashToken(user_id);

    if (!getRemainderHash) {
      throw new AppError('The Hash Token not found!');
    }

    const { remainder_hash_token, expires_in } = getRemainderHash;
    const ensureCompleteHashToken: boolean = validate(`${hashTokenKey}-${remainder_hash_token}`);

    if (!ensureCompleteHashToken) {
      throw new AppError('Hash Token Key are invalid!');
    }

    const now = await this.dateProvider.dateNow();
    const expiresInUTC = await this.dateProvider.replaceToUTC(expires_in);
    const ensureHashTokenAlreadyIsValid: boolean = await this
      .dateProvider
      .compareIfBefore(now, expiresInUTC);

    if (!ensureHashTokenAlreadyIsValid) {
      throw new AppError('Hash Token as expired!');
    }

    const hashThePassword = await hash(new_password, 10);

    await this
      .clientRepository
      .updateUserPassword(user_id, hashThePassword);

    await this.clientRepository
      .removeHashTokenKey(user_id);

    //[] - Realizar o envio de Email de confirmação de alteração de Password;
    //[] - Implementação dos Providers de envio de Email
    //[] - Realizar a remoção do Hash Token Key e Remainder Hash Token;
    //[] - Realizar o Update na data para ser possível realizar um novo reset de Password;
    //[] - Realizar contagem de resets de passwords por dia;
    //[] - Se o User tentar realizar mais resets do que o permitido sua sessão é expirada;
  }

}