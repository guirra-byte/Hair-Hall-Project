import { ICreateHairHallServicingDTO } from "../dtos/ICreateHaiHallServicingDTO";
import { Servicing } from "../model/Servicing";

export interface IHairHallServicingRepository {
  createServicing({
    name,
    description,
    attendance_id,
    gen,
    scheduleDays,
    scheduleHours,
    serviceValue
  }: ICreateHairHallServicingDTO): Promise<void>
  findByName(servicingName: string): Promise<Servicing>
  removeServicing(servicingName: string, admin_id: string): Promise<void>
}