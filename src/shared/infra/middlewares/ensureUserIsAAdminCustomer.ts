import { Request, Response, NextFunction } from "express";

export const ensureUserIsAAdminCustomer = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<boolean> => {

  const employeeRepository: IEmployeeRepository = EmployeeRepository.getInstance();
  const { id: user_id } = request.client;
  const ensureUserIsAAdminCustomer = await employeeRepository
    .findById(user_id);

  if (!ensureUserIsAAdminCustomer) {
    return false;
  }

  next();
  return true;

}