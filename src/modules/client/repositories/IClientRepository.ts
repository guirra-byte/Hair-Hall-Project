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
    phoneNumber
  }: ICreateClientDTO): Promise<Client<IClientProps>>
  findByEmail(email: string): Promise<Client<IClientProps>>
}