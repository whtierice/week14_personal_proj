import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutRecordsController } from './workout-records.controller';
import { WorkoutRecordsService } from './workout-records.service';
import { WorkoutRecord } from './entities/workout-record.entity';
import { CompletedExercise } from './entities/completed-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutRecord, CompletedExercise])],
  controllers: [WorkoutRecordsController],
  providers: [WorkoutRecordsService],
  exports: [WorkoutRecordsService],
})
export class WorkoutRecordsModule {}