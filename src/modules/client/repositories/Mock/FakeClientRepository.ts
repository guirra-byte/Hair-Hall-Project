import { ICreateClientDTO } from "../../dtos/ICreateClientDTO";
import { IClientRepository } from "../IClientRepository";
import { Client } from "../../model/Client";
export interface IClientProps {

  name: string;
  middleName: string;
  email: string;
  password: string;
  phoneNumber: number;
  lastForgotPasswordRequest?: string;
}
export class FakeClientRepository implements IClientRepository {

  private repository: Client<IClientProps>[];
  constructor() {
    this.repository = [];
  }

  async create({
    name,
    middleName,
    email,
    password,
    phoneNumber,

  }: ICreateClientDTO): Promise<Client<IClientProps>> {

    const client = new Client<IClientProps>({
      name,
      middleName,
      email,
      password,
      phoneNumber
    });

    this.repository.push(client)
    return client;
  }

  async findByEmail(email: string): Promise<Client<IClientProps>> {

    const findClientByEmailIndex = this
      .repository
      .findIndex((client) => client.props.email === email);

    const client = this.repository[findClientByEmailIndex];
    return client;
  }

  async findById(id: string): Promise<Client<IClientProps>> {

    const findClientIndexById = this
      .repository
      .findIndex(client => client.id === id);

    const client = this.repository[findClientIndexById];
    return client;
  }

  async updateLastForgotPasswordRequest(user_id: string, dateNow: string): Promise<void> {
    const findClientIndexById = this
      .repository
      .findIndex(client => client.id === user_id);

    this.repository[findClientIndexById]
      .props
      .lastForgotPasswordRequest = dateNow;

  }

  async removeClientById(id: string): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(client => client.id === id);

    await this.repository.splice(clientIndex, 1);
  }
}