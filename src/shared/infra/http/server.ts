import { app } from "../../../app";
import 'express-async-errors';
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const SERVER_PORT: number = 1122;

app.use((
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): Response => {

  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ error: `${error.message}` });
  }

  return response
    .status(500)
    .json({ error: `Internal server error: ${error}` });
});

app.listen(SERVER_PORT,
  () => console.log(`O Server já está rodando na Porta: ${SERVER_PORT}`)
);