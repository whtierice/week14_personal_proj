import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { Routine } from './entities/routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService, TypeOrmModule.forFeature([Routine])],
})
export class RoutinesModule {}