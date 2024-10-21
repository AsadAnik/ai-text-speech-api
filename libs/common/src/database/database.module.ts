import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: +configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                entities: [join(__dirname, '../../../shared/src/entities/**/*.entity{.ts,.js}')],
                migrations: [join(__dirname, './migrations/*{.ts,.js}')],
                migrationsRun: true,  // Automatically run migrations on app start
                autoLoadEntities: true,
                // synchronize: false,   // Disable synchronize in production
                synchronize: configService.get<string>('NODE_ENV') !== 'production',
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
