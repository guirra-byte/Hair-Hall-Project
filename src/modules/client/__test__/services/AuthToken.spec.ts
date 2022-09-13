import { FakeClientRepository } from "../../repositories/Mock/FakeClientRepository";
import { IRefreshTokenRepository } from "../../repositories/IRefreshTokenRepository";
import { FakeRefreshTokenRepository } from '../../repositories/Mock/FakeRefreshTokenRepository';
import { IDateProvider } from "../../../../shared/providers/Date/IDateProvider";
import { DateProvider } from "../../../../shared/providers/Date/implementations/DateProvider";
import { TokenService } from "../../services/Auth/TokenService";
import { v4 as uuidV4 } from 'uuid';
import { AppError } from "../../../../shared/infra/errors/AppError";

describe("Create a new Client Auth Token Service", () => {
  let fakeClientRepository: FakeClientRepository;
  let tokenService: TokenService;
  let refreshTokenRepository: IRefreshTokenRepository;
  let dateProvider: IDateProvider;

  beforeEach(async () => {
    fakeClientRepository = new FakeClientRepository();
    refreshTokenRepository = new FakeRefreshTokenRepository();
    dateProvider = new DateProvider();
    tokenService = new TokenService(fakeClientRepository, refreshTokenRepository, dateProvider);
  });

  it("Should be able to authenticate user",
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

      expect(token).toHaveProperty('token');
      expect(token.token).not.toBeUndefined();

      expect(token).toHaveProperty('client');
      expect(token.client).not.toBeUndefined();
    });

  it("Should not be able to authenticate user; case: Email are incorrect", async () => {
    expect(async () => {
      await tokenService
        .execute("matheus.sousa@gmail.com", uuidV4());
    }).rejects
      .toBeInstanceOf(AppError);
  });
});