import { IMailProvider } from "../IMailProvider";
import { IClientRepository } from "../../../../modules/client/repositories/IClientRepository";
import { FakeClientRepository } from "../../../../modules/client/repositories/Mock/FakeClientRepository";
import { IDateProvider } from "../../Date/IDateProvider";
import { DateProvider } from "../../Date/implementations/DateProvider";

export class MailProvider implements IMailProvider {
  private dateProvider: IDateProvider;
  private clientRepository: IClientRepository;

  constructor() {
    this.dateProvider = new DateProvider()
    this.clientRepository = new FakeClientRepository();
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {

  }
}