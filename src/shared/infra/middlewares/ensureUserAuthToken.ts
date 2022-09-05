import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AUTH } from '../../../config/auth';
import { AppError } from '../errors/AppError';

interface IPayload {
  sub: string;
}

export const ensureUserAuthToken = async (request: Request, response: Response, next: NextFunction) => {

  const authHeader: string | undefined = request.headers.authorization;

  if (authHeader === undefined) {
    throw new AppError('JWT Token is missing!',
      401,
      'middlewares_ensureUserAuthToken');
  }

  const [, token] = authHeader.split(" ");

  try {
    const { AUTH_TOKEN_SECRET_KEY } = AUTH;
    const { sub: user_id } = verify(token, AUTH_TOKEN_SECRET_KEY) as IPayload;

    request.client = { id: user_id }
  } catch {
    throw new AppError('JWT Token are invalid!',
      401,
      'middlewares_ensureUserAuthToken');
  }
}
