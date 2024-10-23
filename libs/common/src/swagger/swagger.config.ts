import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {
    /**
     * SWAGGER SETUP AND CONFIGURATIONS ADAPTER
     * @param app 
     * @param serviceName 
     */
    static setup(app: INestApplication, serviceName: string): void {
        const config = new DocumentBuilder()
            .setTitle(`${serviceName} API`)
            .setDescription(`API Documentation for ${serviceName}`)
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document);
    }
}