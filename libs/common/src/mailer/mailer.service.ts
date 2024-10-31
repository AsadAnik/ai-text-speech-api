import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService){}

    /**
     * EMAIL SENDING WITH NODEMAILER SERVICE..
     * @param email 
     * @param verificationCode 
     */
    public async sendVerificationMail(email: string, verificationCode: string): Promise<void> {
        // Create a transporter object using the default SMTP transport
        const transport = nodemailer.createTransport({
            service: 'gmail',
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });

        // Define the email content..
        const mailOptions = {
            from: `AI Text to Speech <${this.configService.get<string>('MAIL_USER')}>`,
            to: email,
            subject: 'Your account verification code',
            text: `Your account verification code is ${verificationCode}`,
            html: `<p>Your account verification code is <strong>${verificationCode}</strong></p>`,
        };

        // Let's send the mail..
        try {
            await transport.sendMail(mailOptions)
            console.log('Verification mail sent successfully');

        } catch (error) {
            console.error('Error sending verification mail: ', error);
            throw new HttpException('Error sending verification mail', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}