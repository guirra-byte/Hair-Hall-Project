
export enum SERVICING_GEN {
  MASC = 'MASCULINO',
  FEM = 'FEMININO'
}

export enum SERVICING_SCHEDULE_DAYS {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

export class Servicing {
  name: string;
  description: string;
  gen: SERVICING_GEN;
  serviceValue: number;
  attendance_id: string;
  scheduleDays: SERVICING_SCHEDULE_DAYS;
  scheduleHours: string | string[];

  constructor(name: string, description: string, gen: SERVICING_GEN, serviceValue: number, attendance_id: string, scheduleDays: SERVICING_SCHEDULE_DAYS, scheduleHours: string | string[]) {

    this.name = name;
    this.description = description;
    this.gen = gen;
    this.serviceValue = serviceValue;
    this.attendance_id = attendance_id;
    this.scheduleDays = scheduleDays;
    this.scheduleHours = scheduleHours;
  }
}