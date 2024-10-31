import { Global, Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
    imports: [ConfigModule.forRoot()],
    providers: [MailerService],
    exports: [MailerService],
})

export class MailerModule {}