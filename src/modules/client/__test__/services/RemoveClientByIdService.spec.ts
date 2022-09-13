import { IClientRepository } from "../../repositories/IClientRepository";
import { FakeClientRepository } from '../../repositories/Mock/FakeClientRepository';
import { RemoveClientByIdService } from '../../services/RemoveClientByIdService';
import { v4 as uuidV4 } from 'uuid';
import { AppError } from '../../../../shared/infra/errors/AppError';

describe("Remove a client by id", () => {
  let clientRepository: IClientRepository;
  let removeClientByIdService: RemoveClientByIdService;

  beforeEach(async () => {
    clientRepository = new FakeClientRepository();
    removeClientByIdService = new RemoveClientByIdService(clientRepository);
  });

  it("Should be able to remove a client by id", async () => {
    const client = await clientRepository
      .create({
        name: "Matheus",
        middleName: "Guirra",
        email: "mabelIsReal@gmail.com",
        password: uuidV4(),
        phoneNumber: 92839756
      });

    expect(client).toHaveProperty('id');
    const { id, props: { email } } = client;

    await removeClientByIdService.execute(id);
    const findClient = await clientRepository
      .findByEmail(email);

    expect(findClient).toBeUndefined();

  });

  it("Should not be able to remove a client by id; case: Client does not exists", async () => {
    expect(async () => {
      await removeClientByIdService.execute(uuidV4());
    }).rejects
      .toBeInstanceOf(AppError);
  });
});