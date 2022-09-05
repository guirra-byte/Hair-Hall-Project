import {
  CreateHairHallServicingService
} from '../../services/CreateHairHallServicingService';
import {
  FakeHairHallServicingRepository
} from '../../repositories/Mocks/FakeHairHallServicingRepository';
import { IDateProvider } from '../../../../shared/providers/Date/IDateProvider';
import { DateProvider } from '../../../../shared/providers/Date/implementations/DateProvider';

import {
  Servicing,
  SERVICING_GEN,
  SERVICING_SCHEDULE_DAYS
} from '../../model/Servicing';

describe("Create a hair hall service", () => {
  let createHairHallServicing: CreateHairHallServicingService;
  let fakeHairHallServicingRepository: FakeHairHallServicingRepository;
  let dateProvider: IDateProvider;

  beforeEach(async () => {
    dateProvider = new DateProvider();
    fakeHairHallServicingRepository = new FakeHairHallServicingRepository();
    createHairHallServicing = new CreateHairHallServicingService(
      fakeHairHallServicingRepository,
      dateProvider
    );
  });

  it("Should be able create a new Hair Hall Service", async () => {

    const { FRIDAY, MONDAY, TUESDAY } = SERVICING_SCHEDULE_DAYS;
    const { MASC } = SERVICING_GEN;

    const hairHallServicing: Servicing = {
      name: "Corte Tramontina",
      description: "Corte de cabelo + modelagem de sobrancelha + platinagem no cabelo",
      gen: MASC,
      serviceValue: 125.99,
      attendance_id: '2',
      scheduleDays:
        FRIDAY
        && MONDAY
        && TUESDAY,
      scheduleHours: [
        '14:40:36-03:00',
        '15:40:36-03:00',
        '17:40:36-03:00']
    }

    const {
      name,
      gen,
      serviceValue,
      attendance_id,
      scheduleDays,
      scheduleHours
    } = hairHallServicing;

    await createHairHallServicing.execute({
      name: name,
      gen: gen,
      serviceValue: serviceValue,
      scheduleDays: scheduleDays,
      scheduleHours: scheduleHours,
      attendance_id: attendance_id
    });

    const findServicingByName = await fakeHairHallServicingRepository
      .findByName(name);

    expect(findServicingByName)
      .toHaveProperty('id');

    expect(findServicingByName)
      .toMatchObject(hairHallServicing);
  });
});