import {
  ICreateClientDTO
} from "../dtos/ICreateClientDTO";
import { Client } from "../model/Client";
import { IClientProps } from "./Mock/FakeClientRepository";

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
  updateLastForgotPasswordRequest(user_id: string, dateNow: string): Promise<void>
  removeClientById(id: string): Promise<void>
  findById(id: string): Promise<Client<IClientProps>>
}