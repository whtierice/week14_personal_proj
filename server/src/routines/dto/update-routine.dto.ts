import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExerciseDto } from '../../exercises/dto/create-exercise.dto';

export class UpdateRoutineDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  @IsOptional()
  exercises?: CreateExerciseDto[];
}