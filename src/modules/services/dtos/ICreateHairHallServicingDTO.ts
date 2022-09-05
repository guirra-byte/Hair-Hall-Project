import {
  SERVICING_GEN,
  SERVICING_SCHEDULE_DAYS
} from '../model/Servicing';

export interface ICreateHairHallServicingDTO {
  name: string;
  description: string;
  gen: SERVICING_GEN
  serviceValue: number;
  attendance_id: string;
  scheduleDays: SERVICING_SCHEDULE_DAYS;
  scheduleHours: string | string[];
}