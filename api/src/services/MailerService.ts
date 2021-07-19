import {IMailerService} from '@/interfaces/services';
import nodemailer from 'nodemailer';

export default class MailerService implements IMailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    private host: string,
    private auth: {
      username: string;
      password: string;
    }
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.auth.username,
        pass: this.auth.password
      },
      tls: {rejectUnauthorized: false}
    });
  }

  async send(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `OCP <${this.auth.username}@${this.host}>`, // sender address
      to,
      subject,
      text
    });
  }
}
