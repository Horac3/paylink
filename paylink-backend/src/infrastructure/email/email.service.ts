import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export interface MailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

/**
 * @description Email service using Nodemailer with Handlebars templates.
 * Configured from SMTP_* env vars. Swap to business email by updating 4 env vars only.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly templateCache = new Map<
    string,
    HandlebarsTemplateDelegate
  >();

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: config.get<string>('SMTP_USER'),
        pass: config.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  /**
   * @description Send a templated email.
   * @param options Mail options including template name and Handlebars context
   * @throws Will log and swallow errors — email failure must not break payment flows
   */
  async sendMail(options: MailOptions): Promise<void> {
    try {
      const html = this.renderTemplate(options.template, options.context);
      await this.transporter.sendMail({
        from: this.config.get<string>('EMAIL_FROM'),
        to: options.to,
        subject: options.subject,
        html,
        attachments: options.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });
      this.logger.log(
        `Email sent to ${options.to} — template: ${options.template}`,
      );
    } catch (err) {
      this.logger.error(
        `Email failed to ${options.to}: ${(err as Error).message}`,
      );
    }
  }

  private renderTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): string {
    if (!this.templateCache.has(templateName)) {
      const templatePath = path.join(
        __dirname,
        '../../notification/templates',
        `${templateName}.hbs`,
      );
      if (!fs.existsSync(templatePath)) {
        this.logger.warn(`Template not found: ${templatePath}, using fallback`);
        return `<p>${JSON.stringify(context)}</p>`;
      }
      const source = fs.readFileSync(templatePath, 'utf-8');
      this.templateCache.set(templateName, Handlebars.compile(source));
    }
    return this.templateCache.get(templateName)!(context);
  }
}
