import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { Routine } from '../routines/entities/routine.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
  ) {}

  async findByRoutine(routineId: string, userId: string): Promise<Exercise[]> {
    const routine = await this.routinesRepository.findOne({
      where: { id: routineId },
    });

    if (!routine) {
      throw new NotFoundException(`Routine with ID ${routineId} not found`);
    }

    if (routine.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this routine');
    }

    return this.exercisesRepository.find({
      where: { routineId },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['routine'],
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    if (exercise.routine.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this exercise');
    }

    return exercise;
  }

  async create(routineId: string, createExerciseDto: CreateExerciseDto, userId: string): Promise<Exercise> {
    const routine = await this.routinesRepository.findOne({
      where: { id: routineId },
    });

    if (!routine) {
      throw new NotFoundException(`Routine with ID ${routineId} not found`);
    }

    if (routine.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this routine');
    }

    const exercise = this.exercisesRepository.create({
      ...createExerciseDto,
      routineId,
    });

    return this.exercisesRepository.save(exercise);
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto, userId: string): Promise<Exercise> {
    const exercise = await this.findOne(id, userId);
    
    Object.assign(exercise, updateExerciseDto);
    
    return this.exercisesRepository.save(exercise);
  }

  async remove(id: string, userId: string): Promise<void> {
    const exercise = await this.findOne(id, userId);
    await this.exercisesRepository.remove(exercise);
  }
}