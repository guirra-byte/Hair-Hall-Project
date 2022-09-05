import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { IClientRepository } from '../../repositories/IClientRepository';
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

  constructor(private clientRepository: IClientRepository) { }
  async execute(email: string, password: string): Promise<IRequest> {

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
      AUTH_TOKEN_SECRET_KEY
    } = AUTH;

    const token = sign(
      {},
      AUTH_TOKEN_SECRET_KEY, {
      expiresIn: AUTH_TOKEN_EXPIRES_IN,
      subject: ensureClientEmailAlreadyExists.id
    });

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