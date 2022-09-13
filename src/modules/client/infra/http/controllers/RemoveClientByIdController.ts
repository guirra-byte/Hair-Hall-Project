import { Request, Response } from 'express';
import { RemoveClientByIdService } from '../../../services/RemoveClientByIdService';

export class RemoveClientByIdController {
  constructor(private removeClientByIdService: RemoveClientByIdService) { }

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    await this
      .removeClientByIdService
      .execute(id);

    return response.status(400).send();

  }
}