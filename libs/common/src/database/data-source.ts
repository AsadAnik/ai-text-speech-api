import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@app/shared/entities/user.entity';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

// Create a ConfigService instance to get .env values
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'), // Fetch from .env via ConfigService
  port: Number(configService.get<number>('POSTGRES_PORT')), // Convert string to number
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [User],  // Include all the entities you want to be reflected in the database
  migrations: [join(__dirname, '/migrations/*.js')], // Adjust the migration path if needed
  synchronize: false,  // Ensure it's disabled in production
});
