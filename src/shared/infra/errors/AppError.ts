export class AppError {
  message: string;
  statusCode: number;
  module: string;

  constructor(message: string, statusCode = 400, module = 'default') {
    this.message = message;
    this.statusCode = statusCode;
    this.module = module;
  }
}