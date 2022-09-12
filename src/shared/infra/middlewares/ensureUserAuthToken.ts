import { Request, Response, NextFunction } from 'express';
import { FakeClientRepository } from '../../../modules/client/repositories/Mock/FakeClientRepository';
import { verify } from 'jsonwebtoken';
import { AUTH } from '../../../config/auth';
import { AppError } from '../errors/AppError';
interface IPayload {
  sub: string;
}

export const ensureUserAuthToken = async (request: Request, response: Response, next: NextFunction) => {

  const authHeader: string | undefined = request.headers.authorization;

  if (authHeader === undefined) {
    throw new AppError('Refresh Token is missing!',
      401,
      'middlewares_ensure_user_authToken');
  }

  const [, refresh_token] = authHeader.split(" ");

  try {
    const clientRepository = new FakeClientRepository();

    const { AUTH_TOKEN_SECRET_KEY } = AUTH;
    const { sub: user_id } = verify(refresh_token, AUTH_TOKEN_SECRET_KEY) as IPayload;

    const ensureClientExists = await clientRepository
      .findById(user_id);

    if (!ensureClientExists) {
      throw new AppError(
        'Client does not exists!',
        400,
        'middlewares_ensure_user_authToken'
      );
    }

    request.client = { id: user_id, refresh_token }

  } catch {
    throw new AppError(
      'Refresh Token are invalid!',
      401,
      'middlewares_ensure_user_authToken'
    );
  }
}
