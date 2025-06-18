import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('magic_links')
export class MagicLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  rememberMe: boolean;

  @CreateDateColumn()
  createdAt: Date;
}