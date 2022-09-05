import { ICreateHairHallServicingDTO } from "../../dtos/ICreateHaiHallServicingDTO";
import { Servicing } from "../../model/Servicing";
import { IHairHallServicingRepository } from "../IHairHallServicingRepository";

export class FakeHairHallServicingRepository implements IHairHallServicingRepository {

  private repository: Servicing[];
  constructor() {
    this.repository = [];
  }

  async createServicing(props: ICreateHairHallServicingDTO): Promise<void> {

    const {
      name,
      description,
      gen,
      attendance_id,
      serviceValue,
      scheduleDays,
      scheduleHours
    } = props;

    const createServicing = new Servicing(name,
      description,
      gen,
      serviceValue,
      attendance_id,
      scheduleDays,
      scheduleHours);

    await this.repository.push(createServicing);
  }

  async findByName(servicingName: string): Promise<Servicing> {
    const findServicingIndexByName = await this.repository
      .findIndex((servicing) => servicing.name
        === servicingName);

    return this.repository[findServicingIndexByName];
  }

  async removeServicing(
    servicingName: string,
    admin_id: string
  ): Promise<void> {
    const findServicingIndexByName = await this.repository
      .findIndex((servicing) => servicing.name
        === servicingName);

    await this.repository.splice(findServicingIndexByName);
  }
}