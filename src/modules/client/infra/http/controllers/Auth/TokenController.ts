import { Request, Response } from 'express';
import { TokenService } from '../../../../services/Auth/TokenService';

export class TokenController {

  constructor(private clientTokenService: TokenService) { }
  async handle(request: Request, response: Response): Promise<Response> {

    const { email, password } = request.body;

    const tokenService = await this
      .clientTokenService
      .execute(email, password);

    return response.status(201).json(tokenService);

  }
}