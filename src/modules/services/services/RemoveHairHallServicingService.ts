import { AppError } from "../../../shared/infra/errors/AppError";
import {
  IHairHallServicingRepository
} from "../repositories/IHairHallServicingRepository";

export class RemoveHairHallServicingService {
  constructor(
    private hairHallServicingRepository: IHairHallServicingRepository,
    private employeeRepository: IEmployeeRepository) { }
  async execute(servicingName: string, admin_id: string): Promise<void> {

    const ensureServicingExists = await this.hairHallServicingRepository
      .findByName(servicingName);
    if (!ensureServicingExists) {
      throw new AppError(
        'Servicing does not exists',
        400,
        'remove_hair_hall_servicing'
      );
    }

    const ensureUserIsAdmin: boolean = await this.employeeRepository
      .ensureUserIsAdmin(admin_id);
    if (!ensureUserIsAdmin) {
      throw new AppError(
        'User does not a Admin Customer',
        400,
        'remove_hair_hall_servicing'
      );
    }

    await this
      .hairHallServicingRepository
      .removeServicing(servicingName, admin_id);
  }
}