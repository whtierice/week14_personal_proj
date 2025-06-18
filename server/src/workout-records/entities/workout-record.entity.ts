import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Routine } from '../../routines/entities/routine.entity';
import { CompletedExercise } from './completed-exercise.entity';

@Entity('workout_records')
export class WorkoutRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  duration: number; // 초 단위

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Routine)
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;

  @Column()
  routineName: string;

  @OneToMany(() => CompletedExercise, completedExercise => completedExercise.workoutRecord, { cascade: true })
  completedExercises: CompletedExercise[];

  @CreateDateColumn()
  createdAt: Date;
}