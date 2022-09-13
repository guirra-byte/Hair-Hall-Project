import { IClientRepository } from "../repositories/IClientRepository";
import { AppError } from "../../../shared/infra/errors/AppError";

export class RemoveClientByIdService {
  constructor(private clientRepository: IClientRepository) { }
  async execute(id: string) {
    const ensureClientExists = await this.clientRepository
      .findById(id);

    if (!ensureClientExists) {
      throw new AppError(
        'Client does not exists!',
        400,
        'remove_clientById_service');
    }

    await this.clientRepository
      .removeClientById(id);

  }
}