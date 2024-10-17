import { Controller, Post, Get, Body, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('api')
export class ApiGateController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject('TEXT_VOICE_SERVICE') private readonly textVoiceClient: ClientProxy,
    ) {}

    // Client for Auth Service
    // region Auth Service Client
    // @Client({
    //     transport: Transport.RMQ,
    //     options: {
    //         urls: ['amqp://localhost:5672'],
    //         queue: 'auth_queue',
    //         queueOptions: {
    //             durable: false,
    //         },
    //     },
    // })
    // private authClient: ClientProxy;

    // Client for User Service
    // region User Service Client
    // @Client({
    //     transport: Transport.RMQ,
    //     options: {
    //         urls: ['amqp://localhost:5672'],
    //         queue: 'user_queue',
    //         queueOptions: {
    //             durable: false,
    //         },
    //     },
    // })
    // private userClient: ClientProxy;

    // Client for Text-Voice Service
    // region Text-Voice Service Client
    // @Client({
    //     transport: Transport.RMQ,
    //     options: {
    //         urls: ['amqp://localhost:5672'],
    //         queue: 'text_voice_queue',
    //         queueOptions: {
    //             durable: false,
    //         },

    //         // Add a timeout here (in milliseconds)
    //         socketOptions: {
    //             heartbeat: 120, // Keep the connection alive with a 60-second heartbeat
    //         },
    //     },
    // })
    // private textVoiceClient: ClientProxy;

    // Route for user login (calls Auth Service)
    // region Auth Login Service
    @Post('login')
    async login(@Body() loginData: any): Promise<Observable<any>> {

        try {
            const response = await this.authClient.send({ cmd: 'login' }, loginData).toPromise();
            console.log('Login Data: ', response);
            return response;

        } catch (error) {
            // Return a custom error message
            throw new HttpException('Auth service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    // Route for fetching user profile (calls User Service)
    // region User Profile Service
    @Get('profile')
    async getProfileById(@Body() userId: number): Promise<Observable<any>> {
        try {
            const response = await this.userClient.send({ cmd: 'get_user_profile' }, userId).toPromise();
            console.log('Profile Data: ', response);
            return response;

        } catch (error) {
            // Return a custom error message
            throw new HttpException('User service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    // Route for fetching texts and voices (calls Text-Voice Service)
    // region Text-Voice Service
    @Get('ai')
    async getTextVoice(@Body() userId: number): Promise<Observable<any>> {
        try {
            const response = await this.textVoiceClient.send({ cmd: 'get_text_voice' }, userId).toPromise();
            console.log('Text Voice Data: ', response);
            return response;

        } catch (error) {
            // Return a custom error message
            throw new HttpException('Text-Voice service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    // region Emit Message
    @Get('emit')
    async all() {
        this.textVoiceClient.emit('myEmit', 'I am from Emit here');
    }
}
