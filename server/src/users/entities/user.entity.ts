import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Routine } from '../../routines/entities/routine.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Routine, routine => routine.user)
  routines: Routine[];
  
  // 게시판 기능은 구현하지 않지만 타입 오류를 방지하기 위해 속성 추가
  posts: any[];
  comments: any[];
}