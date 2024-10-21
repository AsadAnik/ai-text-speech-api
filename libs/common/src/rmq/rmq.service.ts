import { Injectable } from "@nestjs/common";
import { RmqOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService) {}

    /**
     * GET OPTIONS FOR RABBITMQ
     * @param queue 
     * @param noAck 
     * @returns 
     */
    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URI')],
                // urls: ['amqp://guest:guest@localhost:5672'],
                // urls: ['amqp://localhost:5672'],
                queue: queue,
                queueOptions: { durable: false },
                noAck,
            },
        }
    }
}