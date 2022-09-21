import {
  ICreateClientDTO
} from "../dtos/ICreateClientDTO";
import { Client } from "../model/Client";
import { IClientProps } from "./Mock/FakeClientRepository";
import { IRemainderHashTokenProps } from './Mock/FakeClientRepository';
export interface IClientRepository {
  create({
    name,
    middleName,
    email,
    password,
    phoneNumber,
    lastForgotPasswordRequest
  }: ICreateClientDTO): Promise<Client<IClientProps>>
  findByEmail(email: string): Promise<Client<IClientProps>>
  findById(id: string): Promise<Client<IClientProps>>
  findRemainderHashToken(id: string): Promise<IRemainderHashTokenProps | undefined>
  saveHashToken(id: string, hashTokenKey: string): Promise<void>
  saveRemainderHashToken(id: string, remainderHashToken: string): Promise<void>
  removeHashTokenKey(id: string): Promise<void>
  removeClientById(id: string): Promise<void>
  updateLastForgotPasswordRequest(user_id: string, dateNow: string): Promise<void>
  updateHashExpiresIn(client_id: string, expires_in: Date): Promise<void>
  updateUserPassword(id: string, new_password: string): Promise<void>
}