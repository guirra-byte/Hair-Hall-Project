import { FakeClientRepository } from '../../repositories/Mock/FakeClientRepository';
import { CreateClientService } from '../../services/CreateClientService';
import { DateProvider } from '../../../../shared/providers/Date/implementations/DateProvider';
import { IDateProvider } from '../../../../shared/providers/Date/IDateProvider';

describe("Create a new Client Service", () => {
  let dateProvider: IDateProvider
  let fakeClientRepository: FakeClientRepository;
  let createClientService: CreateClientService;

  beforeEach(async () => {
    dateProvider = new DateProvider();
    fakeClientRepository = new FakeClientRepository();
    createClientService = new CreateClientService(fakeClientRepository);
  });

  it("Should be able to create a new Client", async () => {
    const client = {
      name: "Matheus",
      middleName: "Guirra",
      email: "guirramatheus1@gmail.com",
      password: "Mabel_2022",
      phoneNumber: 92839756
    }

    console.log(process.env.NODE_ENV);
    const createClient = await createClientService.execute(client);
    expect(createClient).toHaveProperty('id');
  });
});