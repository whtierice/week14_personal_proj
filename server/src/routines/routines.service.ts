import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routinesRepository: Repository<Routine>,
  ) {}

  async findAll(userId: string): Promise<Routine[]> {
    return this.routinesRepository.find({
      where: { userId },
      relations: ['exercises'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Routine> {
    const routine = await this.routinesRepository.findOne({
      where: { id },
      relations: ['exercises'],
    });

    if (!routine) {
      throw new NotFoundException(`Routine with ID ${id} not found`);
    }

    if (routine.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this routine');
    }

    return routine;
  }

  async create(createRoutineDto: CreateRoutineDto, userId: string): Promise<Routine> {
    const routine = this.routinesRepository.create({
      ...createRoutineDto,
      userId,
    });

    return this.routinesRepository.save(routine);
  }

  async update(id: string, updateRoutineDto: UpdateRoutineDto, userId: string): Promise<Routine> {
    const routine = await this.findOne(id, userId);
    
    if (updateRoutineDto.name) {
      routine.name = updateRoutineDto.name;
    }
    
    return this.routinesRepository.save(routine);
  }

  async remove(id: string, userId: string): Promise<void> {
    const routine = await this.findOne(id, userId);
    await this.routinesRepository.remove(routine);
  }

  async updateLastCompleted(id: string, userId: string): Promise<Routine> {
    const routine = await this.findOne(id, userId);
    routine.lastCompleted = new Date();
    return this.routinesRepository.save(routine);
  }
}