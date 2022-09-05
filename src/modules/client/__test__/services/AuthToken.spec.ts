import { FakeClientRepository } from "../../repositories/Mock/FakeClientRepository";
import { TokenService } from "../../services/Auth/TokenService";

describe("Create a new Client Auth Token Service", () => {
  let fakeClientRepository: FakeClientRepository;
  let tokenService: TokenService;

  beforeEach(async () => {
    fakeClientRepository = new FakeClientRepository();
    tokenService = new TokenService(fakeClientRepository);
  });

  it("Should be able create a client Auth Token Service",
    async () => {
      const client = await fakeClientRepository.create({
        name: "Matheus",
        middleName: "Guirra",
        email: "guirramatheus1@gmail.com",
        password: "Mabel2022",
        phoneNumber: 556192839767
      });

      const token = await tokenService.execute(client.props.email,
        client.props.password);
      console.log(token);

      expect(token).toHaveProperty('token');
      expect(token).toHaveProperty('client');
    });
});