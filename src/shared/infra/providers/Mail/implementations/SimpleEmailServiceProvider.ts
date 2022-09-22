import nodemailer, { Transporter } from 'nodemailer';
import { SES as SimpleEmailService } from 'aws-sdk';
import { readFileSync, existsSync } from 'fs';
import { IMailProvider } from '../IMailProvider';
import { AppError } from '../../../errors/AppError';
import handlebars from 'handlebars';
export class SimpleEmailServiceProvider implements IMailProvider {

  private client: Transporter;
  private constructor() {
    nodemailer.createTransport(
      {
        SES: new SimpleEmailService(
          {
            apiVersion: '2010-12-01',
            region: process.env.AWS_SERVICES_REGION
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

    const ensureMailTemplateFileExists = existsSync(path);
    if (!ensureMailTemplateFileExists) {
      throw new AppError(
        'This Template File does not exists!',
        400,
        'simple_email_service_provider'
      );
    }

    const renderTemplate = readFileSync(path)
      .toString('utf-8');

    const templateParse = handlebars.compile(renderTemplate);
    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to: to,
      from: "Rentalx <mabeldev@mguirra.dev>",
      subject: subject,
      html: templateHTML
    });
  }
}

