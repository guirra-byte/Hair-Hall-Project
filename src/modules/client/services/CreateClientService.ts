import {
  IClientRepository
} from "../repositories/IClientRepository";
import {
  ICreateClientDTO
} from "../dtos/ICreateClientDTO";

import { hash } from 'bcryptjs';
import { Client } from "../model/Client";
import { IClientProps } from "../repositories/Mock/FakeClientRepository";

export class CreateClientService {

  constructor(private clientRepository: IClientRepository) { }
  async execute({
    name,
    middleName,
    email,
    password,
    phoneNumber
  }: ICreateClientDTO): Promise<Client<IClientProps>> {

    const hashPassword: string = await hash(password, 10);

    const client = await this.clientRepository.create({
      name: name,
      middleName: middleName,
      email: email,
      password: hashPassword,
      phoneNumber: phoneNumber
    });

    return client;
  }
}