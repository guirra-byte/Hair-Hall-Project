declare namespace Express {
  export interface Request {
    client: {
      id: string,
      refresh_token: string
    }
  }
}