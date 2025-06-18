import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  const baseConfig = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  };
  
  if (dbType === 'sqlite') {
    return {
      ...baseConfig,
      type: 'sqlite',
      database: join(process.cwd(), 'fitness_tracker.sqlite'),
    } as TypeOrmModuleOptions;
  }
  
  return {
    ...baseConfig,
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
  } as TypeOrmModuleOptions;
};