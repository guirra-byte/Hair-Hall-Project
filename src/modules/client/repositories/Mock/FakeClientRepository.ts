import { ICreateClientDTO } from "../../dtos/ICreateClientDTO";
import { IClientRepository } from "../IClientRepository";
import { Client } from "../../model/Client";
export interface IRemainderHashTokenProps {
  hash_token: string;
  remainder_hash_token: string;
  expires_in: Date
}
export interface IClientProps {
  name: string;
  middleName: string;
  email: string;
  password: string;
  phoneNumber: number;
  lastForgotPasswordRequest?: string;
  forgotPasswordTokens?: IRemainderHashTokenProps;
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

  async saveHashToken(id: string, hashTokenKey: string): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(user => user.id === id);

    const user = this.repository[clientIndex];
    user.props.forgotPasswordTokens?.hash_token ?? hashTokenKey;
  }

  async removeHashTokenKey(id: string): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(user => user.id === id);

    this.repository[clientIndex]
      .props.forgotPasswordTokens?.hash_token ?? '';
  }

  async updateUserPassword(id: string, new_password: string): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(user => user.id === id);

    this.repository[clientIndex].props.password = new_password;
  }

  async saveRemainderHashToken(id: string, remainderHashToken: string): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(user => user.id === id);

    this.repository[clientIndex].props.forgotPasswordTokens
      ?.remainder_hash_token ?? remainderHashToken;
  }

  async findRemainderHashToken(id: string): Promise<IRemainderHashTokenProps | undefined> {
    const clientIndex = await this.repository
      .findIndex(user => user.id === id);

    const user = this.repository[clientIndex];
    return user.props.forgotPasswordTokens;
  }

  async updateHashExpiresIn(client_id: string, expires_in: Date): Promise<void> {
    const clientIndex = await this.repository
      .findIndex(client => client.id === client_id);
    const client = await this.repository[clientIndex];
    const { props: { forgotPasswordTokens } } = client;
    forgotPasswordTokens.expires_in = forgotPasswordTokens?.expires_in !== undefined
      && forgotPasswordTokens !== undefined ? expires_in : new Date();
  }
}