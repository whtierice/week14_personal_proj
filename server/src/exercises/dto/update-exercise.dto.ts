import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  sets?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  reps?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}