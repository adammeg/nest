import { Injectable } from '@nestjs/common';
import { Logger, MailerService } from 'common/services';
import { config } from 'common/config';
import { User } from '../models';

@Injectable()
export class UserMailerService {

    /**
     * Constructor user mailer service
     * 
     * @param {Logger} logger 
     * @param {MailerService} mailer 
     */
    constructor(private logger: Logger, private mailer: MailerService) {
    }

    /**
     * Send activation mail
     * 
     * @param {User} user
     * @return {void} 
     */
    public sendActivationMail(user: User): void {
        this.logger.log(`Send activation email to ${user}`);

        const confirmEmailUrl = config.client.confirmEmailUrl.replace('{token}', user.confirmationToken);
        const mailOptions = {
            to: user.email,
            subject: 'Activer votre compte',
            html: `Activer votre compte <a href="${confirmEmailUrl}"> en cliquant ici.</a>`,
        };

        this.mailer.sendMail(mailOptions);
    }

    /**
     * Send reset password mail
     * 
     * @param {User} user
     * @return {void} 
     */
    public sendResetPasswordMail(user: User): void {
        this.logger.log(`Send reset password email to ${user}`);

        const resetPasswordUrl = config.client.resetPasswordUrl.replace('{token}', user.confirmationToken);

        const mailOptions = {
            to: user.email,
            subject: 'Réinitialiser votre mot de passe',
            html: `Réinitialiser votre mot de passe <a href="${resetPasswordUrl}"> en cliquant ici.</a>`,
        };

        this.mailer.sendMail(mailOptions);
    }
}
