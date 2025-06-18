import { IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateWorkoutRecordDto {
  @IsString()
  routineId: string;

  @IsString()
  routineName: string;

  @IsDateString()
  date: string;

  @IsNumber()
  duration: number;

  @IsArray()
  completedExercises: string[];
}