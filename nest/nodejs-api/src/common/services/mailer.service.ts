import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { Logger } from './logger.service';
import { config } from '../config';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Mailer;
    private from: string;

    constructor(private logger: Logger) {
        const mailerConfig = config.mailerConfig;
        this.transporter = nodemailer.createTransport(mailerConfig.connectionUrl);
        this.from = `"${mailerConfig.senderName}" ${mailerConfig.senderEmail}`;
    }

    sendMail(mailOptions) {
        mailOptions.from = this.from;
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                this.logger.error(error.name + ' : ' + error.message, error.stack);
            }
        });
    }
}
