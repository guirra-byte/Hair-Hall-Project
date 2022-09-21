export interface IMessageRepository {
  create(
    name: string,
    description: string,
    client_customer_id: string,
    send_date: Date
  ): Promise<void>
}