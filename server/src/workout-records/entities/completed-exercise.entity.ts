import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutRecord } from './workout-record.entity';

@Entity('completed_exercises')
export class CompletedExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exerciseId: string;

  @Column()
  name: string;

  @Column()
  sets: number;

  @Column()
  reps: number;

  @Column({ nullable: true, type: 'float' })
  weight: number;

  @ManyToOne(() => WorkoutRecord, workoutRecord => workoutRecord.completedExercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutRecordId' })
  workoutRecord: WorkoutRecord;

  @Column()
  workoutRecordId: string;
}