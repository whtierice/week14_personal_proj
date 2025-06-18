import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutRecord } from './entities/workout-record.entity';
import { CompletedExercise } from './entities/completed-exercise.entity';
import { CreateWorkoutRecordDto } from './dto/create-workout-record.dto';

@Injectable()
export class WorkoutRecordsService {
  constructor(
    @InjectRepository(WorkoutRecord)
    private workoutRecordsRepository: Repository<WorkoutRecord>,
    @InjectRepository(CompletedExercise)
    private completedExercisesRepository: Repository<CompletedExercise>,
  ) {}

  async findAll(userId: string): Promise<WorkoutRecord[]> {
    return this.workoutRecordsRepository.find({
      where: { userId },
      relations: ['completedExercises'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<WorkoutRecord> {
    const record = await this.workoutRecordsRepository.findOne({
      where: { id },
      relations: ['completedExercises'],
    });

    if (!record) {
      throw new NotFoundException(`Workout record with ID ${id} not found`);
    }

    if (record.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this record');
    }

    return record;
  }

  async create(createWorkoutRecordDto: CreateWorkoutRecordDto, userId: string): Promise<WorkoutRecord> {
    const { completedExercises, ...recordData } = createWorkoutRecordDto;
    
    // 운동 기록 생성
    const record = this.workoutRecordsRepository.create({
      ...recordData,
      userId,
      date: new Date(recordData.date),
    });
    
    // 저장하여 ID 생성
    const savedRecord = await this.workoutRecordsRepository.save(record);
    
    // 완료된 운동 정보 저장
    if (completedExercises && completedExercises.length > 0) {
      // 여기서는 간단히 exerciseId만 저장하고 있지만,
      // 실제로는 Exercise 엔티티에서 정보를 가져와 저장해야 함
      const completedExerciseEntities = completedExercises.map(exerciseId => {
        return this.completedExercisesRepository.create({
          exerciseId,
          name: 'Exercise', // 실제로는 Exercise 엔티티에서 가져와야 함
          sets: 0, // 실제로는 Exercise 엔티티에서 가져와야 함
          reps: 0, // 실제로는 Exercise 엔티티에서 가져와야 함
          workoutRecordId: savedRecord.id,
        });
      });
      
      await this.completedExercisesRepository.save(completedExerciseEntities);
    }
    
    return this.findOne(savedRecord.id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findOne(id, userId);
    await this.workoutRecordsRepository.remove(record);
  }
}