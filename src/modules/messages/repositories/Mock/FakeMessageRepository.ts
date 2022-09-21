import { IMessageRepository } from "../IMessageRepository";

interface IMessageModelMock {
  name: string;
  description: string;
  client_customer_id: string;
  send_date: Date;
}

export class FakeMessageRepository implements IMessageRepository {

  private repository: IMessageModelMock[];
  private constructor() {
    this.repository = [];
  }

  private static INSTANCE: FakeMessageRepository;
  public static getInstance(): FakeMessageRepository {
    if (!FakeMessageRepository.INSTANCE) {
      FakeMessageRepository.INSTANCE = new FakeMessageRepository();
    }

    return FakeMessageRepository.INSTANCE;
  }
  async create(
    name: string,
    description: string,
    client_customer_id: string,
    send_date: Date
  ): Promise<void> {

    const message =
    {
      name: name,
      description: description,
      client_customer_id: client_customer_id,
      send_date: send_date
    }

    this.repository.push(message);
  }
}