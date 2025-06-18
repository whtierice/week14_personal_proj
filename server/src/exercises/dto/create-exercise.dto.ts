import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  sets: number;

  @IsNumber()
  @Min(1)
  reps: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}