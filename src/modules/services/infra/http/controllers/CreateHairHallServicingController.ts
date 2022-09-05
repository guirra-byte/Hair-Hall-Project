import {
  CreateHairHallServicingService
} from "../../../services/CreateHairHallServicingService";
import { Request, Response } from 'express';

export class CreateHairHallServicingController {
  constructor(private createHairHallServicingService: CreateHairHallServicingService) { }
  async handle(request: Request, response: Response): Promise<Response> {

    const {
      name,
      description,
      gen,
      serviceValue,
      scheduleDays,
      scheduleHours
    } = request.body

    const { id: user_id } = request.client;
    await this.createHairHallServicingService.execute({
      name,
      description,
      gen,
      serviceValue,
      scheduleDays,
      scheduleHours,
      attendance_id: user_id
    });

    return response
      .status(201)
      .json('Hair Hall Servicing are created!');
  }
}