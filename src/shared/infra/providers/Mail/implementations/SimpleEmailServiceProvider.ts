import nodemailer, { Transporter } from 'nodemailer';
import { IMailProvider } from '../IMailProvider';
import fs from 'fs';
import { SES as SimpleEmailService } from 'aws-sdk';

export class SimpleEmailServiceProvider implements IMailProvider {

  private client: Transporter;
  private constructor() {
    nodemailer.createTransport({
      SES: new SimpleEmailService({
        apiVersion: '2010-12-01',
        region: process.env.AWS_SERVICE_REGION
      })
    });
  }

  private static INSTANCE: SimpleEmailServiceProvider;
  public static getInstance(): SimpleEmailServiceProvider {
    if (!SimpleEmailServiceProvider.INSTANCE) {
      SimpleEmailServiceProvider.INSTANCE = new SimpleEmailServiceProvider();
    }

    return SimpleEmailServiceProvider.INSTANCE;
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {

    const renderTemplate = fs
      .readFileSync(path)
      .toString('utf-8');

    // const templateParse = handlebarsg
    await this.client.sendMail({
      to: to,
      subject: subject,
      from: 'HairHall <mabeldev@mguirra.dev>',
      html: ''
    });
  }
}