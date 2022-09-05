import { IHairHallServicingRepository } from '../repositories/IHairHallServicingRepository';
import { ICreateHairHallServicingDTO } from '../dtos/ICreateHairHallServicingDTO';
import { IDateProvider } from '../../../shared/providers/Date/IDateProvider';
import { AppError } from '../../../shared/infra/errors/AppError';

export class CreateHairHallServicingService {

  constructor(
    private hairHallServicingRepository: IHairHallServicingRepository,
    private dateProvider: IDateProvider) { }

  async execute({
    name,
    description,
    gen,
    serviceValue,
    scheduleDays,
    scheduleHours,
    attendance_id
  }: ICreateHairHallServicingDTO): Promise<void> {

    const ensureHairHallServicingAlreadyExists = await this
      .hairHallServicingRepository
      .findByName(name);

    if (ensureHairHallServicingAlreadyExists) {
      throw new AppError('Already exists service using his name',
        401,
        'create_hair_hall_servicing');
    }

    const createHairHallServicing = await this
      .hairHallServicingRepository
      .createServicing({
        name: name,
        description: description,
        attendance_id: attendance_id,
        gen: gen,
        serviceValue: serviceValue,
        scheduleDays: scheduleDays,
        scheduleHours: scheduleHours
      });
  }
}