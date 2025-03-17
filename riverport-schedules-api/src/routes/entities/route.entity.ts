import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  startLocation: string;

  @Column()
  endLocation: string;

  @Column('decimal', { precision: 10, scale: 2 })
  distance: number;

  @OneToMany(() => Schedule, schedule => schedule.route)
  schedules: Schedule[];
} 