import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Routine } from '../../routines/entities/routine.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sets: number;

  @Column()
  reps: number;

  @Column({ nullable: true, type: 'float' })
  weight: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Routine, routine => routine.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;
}