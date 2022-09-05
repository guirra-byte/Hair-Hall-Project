import {
  RemoveHairHallServicingService
} from "../../../services/RemoveHairHallServicingService";
import { Request, Response } from 'express';

export class RemoveHairHallServicingController {
  constructor(private removeHairHallServicingService: RemoveHairHallServicingService) { }
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: admin_id } = request.client;
    const { servicingName } = request.body;

    await this.removeHairHallServicingService.execute(servicingName, admin_id);
    return response
      .status(204)
      .send();
  }
}
