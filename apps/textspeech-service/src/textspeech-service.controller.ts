import { Controller, Get, Inject } from "@nestjs/common";
import { TextspeechServiceService } from "./textspeech-service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { MessagePattern } from "@nestjs/microservices";
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { RmqService } from "@app/common";

@Controller("textspeech-service")
export class TextspeechServiceController {
  private authClient: ClientProxy;

  constructor(
    private readonly textspeechServiceService: TextspeechServiceService,
    private readonly rmqService: RmqService
  ) {
    this.authClient = ClientProxyFactory.create(
      this.rmqService.getOptions("auth_queue", true)
    );
  }

  @Get("health")
  getHello(): string {
    return this.textspeechServiceService.getHello();
  }

}
