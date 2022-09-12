import { Request, Response } from 'express';
import {
  ForgotClientAccountPasswordService,
  IResponse
} from '../../../services/ForgotClientAccountPasswordService';

export class ForgotClientAccountPasswordController {
  constructor(private forgotClientAccountPasswordService: ForgotClientAccountPasswordService) { }
  async handle(request: Request, response: Response): Promise<Response> {
    
    const { refresh_token } = request.client;
    const { email } = request.body;
    const { new_password } = request.body;

    const requireForgotPassword: IResponse = await this
      .forgotClientAccountPasswordService
      .execute(refresh_token, email);

    const { message, hash_token } = requireForgotPassword;

    const forgotPassword = await this
      .forgotClientAccountPasswordService
      .handleExecute(
        refresh_token,
        hash_token,
        new_password
      );

    return response
      .status(202)
      .json('Senha foi alterada com sucesso!');
  }
}